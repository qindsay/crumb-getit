import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import imageCompression from "browser-image-compression";
import ReplyModal from "../components/ReplyModal";
import WebcamModal from "../components/WebcamModal";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useNavigate, useLocation } from "react-router-dom";
//import { recipeDetail } from "../data/recipeDetails";
import InstructionBlock from "../components/InstructionBlock";
const BACKEND_URL = "http://127.0.0.1:5001"; // Use http://localhost:5001 if 127.0.0.1 doesn't work

export default function RecipeDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const silenceTimer = useRef(null);
  const [lastTranscript, setLastTranscript] = useState("");
  const [selectedChef, setSelectedChef] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const chefs = useMemo(
    () => [
      { name: "Gordon Ramsay", avatar: "/src/assets/Gordon_Ramsay.png" },
      { name: "Jamie Oliver", avatar: "/src/assets/Jamie_Oliver.png" },
      { name: "Julia Child", avatar: "/src/assets/Julia_Child.png" },
      { name: "Martha Stewart", avatar: "/src/assets/Martha_Stewart.png" },
      { name: "Padma Lakshmi", avatar: "/src/assets/Padma_Lakshmi.png" },
      { name: "Generic Chef", avatar: "/src/assets/Generic_Chef.png" },
    ],
    [],
  );

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();


  // Check for new words and reset silence timer
  useEffect(() => {
    if (listening && transcript !== lastTranscript) {
      setLastTranscript(transcript);
      console.log("New words detected:", transcript);

      // Clear existing timer
      if (silenceTimer.current) {
        clearTimeout(silenceTimer.current);
      }

      // Set new timer
      silenceTimer.current = setTimeout(() => {
        console.log("No new words for 5 seconds, stopping...");
        SpeechRecognition.stopListening();
        if (transcript.trim()) {
          handleSendMessage(transcript);
        }
        resetTranscript();
      }, 5000);
    }
  }, [transcript, listening]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (silenceTimer.current) {
        clearTimeout(silenceTimer.current);
      }
      SpeechRecognition.stopListening();
    };
  }, []);

  if (!browserSupportsSpeechRecognition) {
    return null;
  }

  // Update sendMessage to include selectedChef
  const handleSendMessage = (transcript) => {
    if (selectedChef) {
      sendMessage(transcript);
    }
  };

  const [expandedId, setExpandedId] = useState(null);
  const [buttonState, setButtonState] = useState(
    location.state?.isCompleted ? "completed" : "initial",
  );
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [isWebcamOpen, setIsWebcamOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [error, setError] = useState(null);
  const recipeDetail = location.state.recipe;

  const handleExpand = (instructionId) => {
    setExpandedId(expandedId === instructionId ? null : instructionId);
  };

  const handleComplete = useCallback(() => {
    if (buttonState !== "initial") return;
    setIsWebcamOpen(true);
  }, [buttonState]);

  const validateRecipe = async (imageData) => {
    try {
      // Convert base64 to blob
      const base64Response = await fetch(imageData);
      const blob = await base64Response.blob();

      // Compress image
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: "image/jpeg",
      };

      const compressedBlob = await imageCompression(blob, options);

      // Create a File object from the Blob
      const imageFile = new File([compressedBlob], "image.jpg", {
        type: "image/jpeg",
      });

      // Create FormData and append fields
      const formData = new FormData();
      formData.append("image", imageFile); // Flask expects 'file' in request.files
      formData.append("recipe_id", recipeDetail._id);
      formData.append("user_id", "680dd0320b92db3a52391bc8");

      console.log("Sending FormData with file size:", imageFile.size);

      const response = await fetch(`${BACKEND_URL}/api/validate-and-award`, {
        method: "POST",
        // Let the browser set the correct Content-Type with boundary
        body: formData,
        //mode: "no-cors",
      });

      //const string = await response.text();
      //console.log(string);

      const data = await response.json();
      console.log(data);
      if (data.success) {
        setButtonState("completed");
      } else {
        setButtonState("initial");
        setShowErrorModal(true);
      }
    } catch (error) {
      console.error("Validation error:", error);
      setButtonState("initial");
      setShowErrorModal(true);
    }
  };

  const handleCapture = useCallback((imageSrc) => {
    setCapturedImage(imageSrc);
    setButtonState("loading");
    validateRecipe(imageSrc);
  }, []);

  const sendMessage = async (messageToSend) => {
    console.log("Sending message...");
    if (!messageToSend.trim()) return; // Don't send empty messages or if no recipe
    const currentRecipeContext = {}; // Capture current recipe state
    const currentPersonality = selectedChef["name"]; // Capture current personality

    setIsLoadingChat(true);
    setError(null);

    // Add user message to history optimistically

    const requestBody = {
      message: messageToSend,
      recipe: currentRecipeContext, // Send the current recipe context
      personality: currentPersonality,
    };

    console.log("Sending chat request:", requestBody); // Log request data

    try {
      // Use the BACKEND_URL constant
      const response = await fetch(`${BACKEND_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      console.log("Chat response status:", response.status); // Log response status

      if (!response.ok) {
        // --- Error Handling Fix ---
        // Read the body ONCE as text first.
        const errorText = await response.text();
        let errorMsg = `HTTP error ${response.status}: ${errorText}`;
        try {
          // Try to parse the text as JSON for a more specific error message
          const errorJson = JSON.parse(errorText);
          errorMsg = `HTTP error ${response.status}: ${errorJson.error || errorText}`;
        } catch (parseError) {
          // If it's not JSON, use the raw text.
        }
        throw new Error(errorMsg);
        // --- End Error Handling Fix ---
      }

      // If response.ok is true, parse the JSON body
      const data = await response.json();
      console.log("Chat reply received:", data); // Log received data
      setModalMessage(data.reply);
      setIsModalOpen(true);
    } catch (err) {
      console.error("Failed to send/receive chat message:", err);
      // err.message now contains the detailed error from the backend or fetch failure
      setError(
        `Chat error: ${err.message}. Ensure the backend server at ${BACKEND_URL} is running.`,
      );
      // Optional: Remove the optimistically added user message on error
      // setChatHistory(prev => prev.filter(msg => msg !== newUserMessageEntry));
    } finally {
      setIsLoadingChat(false);
    }
    // Include chatHistory in dependencies ONLY if you send it to the backend
  };

  return (
    <div className="min-h-screen w-full bg-white pb-16 sm:pb-0">
      <div className="w-full max-w-3xl mx-auto px-4 pt-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center px-4 py-2 bg-gray-50 rounded-lg text-gray-600 mb-6 hover:bg-gray-100 transition-colors duration-200 shadow-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back
        </button>

        {/* Recipe Header */}
        <div className="mb-8">
          <div className="aspect-[4/3] w-3/4 mx-auto mb-6">
            <img
              src={recipeDetail.image}
              alt={recipeDetail.name}
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>
          <h1 className="text-2xl font-bold text-primary-300 mb-2">
            {recipeDetail.recipe_name}
          </h1>
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-1">
              <p className="text-gray-600 font-medium">45 minutes</p>
              <p className="text-gray-600 font-medium flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {recipeDetail.servings} servings
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => navigate("/chef-chat")}
                className="flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-lg text-primary-300 hover:bg-primary-100 hover:text-white transition-colors duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                Chat with Chef
              </button>
              <div className="relative">
                {!listening && !isLoadingChat ? (
                  <select
                    value={selectedChef?.name || ""}
                    onChange={(e) => {
                      const chef = chefs.find((c) => c.name === e.target.value);
                      setSelectedChef(chef);
                      if (chef) {
                        resetTranscript();
                        SpeechRecognition.startListening({ continuous: true });
                      } else {
                        SpeechRecognition.stopListening();
                      }
                    }}
                    className="w-full appearance-none bg-primary-50 text-primary-300 px-4 py-2 pr-10 rounded-lg cursor-pointer focus:outline-none hover:bg-primary-100 hover:text-white transition-colors duration-200"
                  >
                    <option value="">Call a Chef</option>
                    {chefs.map((chef) => (
                      <option key={chef.name} value={chef.name}>
                        {chef.name}
                      </option>
                    ))}
                  </select>
                ) : isLoadingChat ? (
                  <div className="w-full flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-300 rounded-lg">
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {selectedChef?.name} is thinking...
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      SpeechRecognition.stopListening();
                      setSelectedChef(null);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 bg-red-50 text-red-500 rounded-lg transition-colors duration-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    {selectedChef?.name} is listening...
                  </button>
                )}
                {!listening && !isLoadingChat && (
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Ingredients Section */}
        <div className="mb-8">
          <button
            onClick={() => handleExpand("ingredients")}
            className="w-full bg-gray-50 rounded-xl p-4 text-left hover:bg-primary-50 transition-colors duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-primary-300">
                  Ingredients
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {recipeDetail.ingredients_used.length} items
                </p>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`w-5 h-5 text-primary-300 transition-transform duration-200 ${
                  expandedId === "ingredients" ? "transform rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </button>

          {expandedId === "ingredients" && (
            <div className="mt-4 bg-white rounded-xl p-6 shadow-lg">
              <ul className="space-y-2">
                {recipeDetail.ingredients_used.map((ingredient, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between text-gray-700"
                  >
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-primary-300 rounded-full mr-3 opacity-75"></span>
                      {ingredient.name}
                    </div>
                    <span className="text-gray-500">{ingredient.amount}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Instructions Section */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-primary-300 mb-4">
            Instructions
          </h2>
          <div className="space-y-4">
            {recipeDetail.instructions.map((instruction, index) => (
              <InstructionBlock
                key={index}
                instruction={instruction}
                stepNumber={index + 1}
                isExpanded={expandedId === index}
                onToggle={() => handleExpand(index)}
              />
            ))}
          </div>
        </div>

        {/* Done Button */}
        <div className="mb-4">
          <button
            onClick={handleComplete}
            disabled={buttonState !== "initial"}
            className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-lg font-medium transition-all duration-200 text-white ${
              buttonState === "completed"
                ? "bg-gray-400 cursor-not-allowed opacity-75"
                : buttonState === "loading"
                  ? "bg-primary-200 cursor-wait"
                  : "bg-primary-300 hover:bg-primary-200"
            }`}
          >
            {buttonState === "loading" ? (
              <>
                LOADING
                <svg
                  className="animate-spin h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </>
            ) : buttonState === "completed" ? (
              <>
                COMPLETED
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </>
            ) : (
              <>
                Done!
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>
      <WebcamModal
        isOpen={isWebcamOpen}
        onClose={() => setIsWebcamOpen(false)}
        onCapture={handleCapture}
      />
      <ReplyModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          console.log("modal closed");
          if (selectedChef) {
            resetTranscript();
            SpeechRecognition.startListening({ continuous: true });
            console.log("modal closed");
          }
        }}
        message={modalMessage}
      />
      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md mx-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Validation Failed
              </h3>
              <p className="text-gray-700 mb-6">
                We couldn't validate your recipe completion. Please try taking
                another photo that clearly shows your completed dish.
              </p>
              <div className="flex justify-end">
                <button
                  onClick={() => setShowErrorModal(false)}
                  className="px-6 py-3 bg-primary-100 text-white rounded-xl hover:bg-primary-200 transition-colors duration-200"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}