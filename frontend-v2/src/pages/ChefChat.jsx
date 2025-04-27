import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ChatMessage from "../components/ChatMessage";
import VoiceInputModal from "../components/VoiceInputModal";
const BACKEND_URL = "http://127.0.0.1:5001"; // Use http://localhost:5001 if 127.0.0.1 doesn't work

const chefs = [
  { name: "Gordon Ramsay", avatar: "/src/assets/Gordon_Ramsay.png" },
  { name: "Jamie Oliver", avatar: "/src/assets/Jamie_Oliver.png" },
  { name: "Julia Child", avatar: "/src/assets/Julia_Child.png" },
  { name: "Martha Stewart", avatar: "/src/assets/Martha_Stewart.png" },
  { name: "Padma Lakshmi", avatar: "/src/assets/Padma_Lakshmi.png" },
  { name: "Generic Chef", avatar: "/src/assets/Generic_Chef.png" },
];

export default function ChefChat() {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollTo({
      top: messagesEndRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, []);

  const [selectedChef, setSelectedChef] = useState(chefs[0]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      text: `Hi! I'm ${chefs[0].name}. How can I help you with your cooking today?`,
      isChef: true,
    },
  ]);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [error, setError] = useState(null);

  const handleVoiceTranscript = useCallback((transcript) => {
    console.log("Received transcript:", transcript);
    setMessage(transcript);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const sendMessage = async (messageToSend) => {
    console.log("Sending message...");
    if (!messageToSend.trim()) return; // Don't send empty messages or if no recipe
    const currentRecipeContext = {}; // Capture current recipe state
    const currentPersonality = selectedChef["name"]; // Capture current personality

    setMessage(""); // Clear input field immediately
    setMessages((prev) => [...prev, { text: messageToSend, isChef: false }]);
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

      // Add assistant response to history
      setMessages((prev) => [
        ...prev,
        {
          text: data.reply,
          isChef: true,
        },
      ]);
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

  const handleSend = useCallback(
    async (e) => {
      e.preventDefault();
      sendMessage(message);
    },
    [message, selectedChef],
  ); // Dependencies for useCallback

  const handleChefChange = (chef) => {
    setSelectedChef(chef);
    setMessages([
      {
        text: `Hi! I'm ${chef.name}. How can I help you with your cooking today?`,
        isChef: true,
      },
    ]);
  };

  return (
    <div className="min-h-screen w-full bg-white pb-48 sm:pb-0">
      <div className="w-full max-w-3xl mx-auto px-2 sm:px-4 pt-6">
        {/* Back Button */}
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

        {/* Chef Selection */}
        <div className="relative mb-6">
          <select
            value={selectedChef.name}
            onChange={(e) =>
              handleChefChange(chefs.find((c) => c.name === e.target.value))
            }
            className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl py-4 px-6 pr-12 text-gray-900 cursor-pointer focus:outline-none focus:border-primary-100 focus:ring-2 focus:ring-primary-100 focus:ring-opacity-20"
          >
            {chefs.map((chef) => (
              <option key={chef.name} value={chef.name}>
                {chef.name}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400"
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
        </div>

        {/* Chat Messages */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6">
          <div
            ref={messagesEndRef}
            className="h-[calc(100vh-400px)] overflow-y-auto p-3 sm:p-6 scroll-smooth"
          >
            {messages.map((msg, index) => (
              <ChatMessage
                key={index}
                message={msg.text}
                isChef={msg.isChef}
                chefAvatar={selectedChef.avatar}
              />
            ))}
          </div>

          {/* Typing Indicator */}
          {isLoadingChat && (
            <div className="px-4 py-2 border-t border-gray-100 bg-gray-50 flex items-center gap-3">
              <div className="w-8 h-8 flex-shrink-0">
                <div className="w-full h-full bg-gray-50 rounded-full p-1">
                  <img
                    src={selectedChef.avatar}
                    alt={`${selectedChef.name} avatar`}
                    className="w-full h-full rounded-full object-contain"
                  />
                </div>
              </div>
              <p className="text-sm text-gray-600">
                {selectedChef.name} is typing...
              </p>
            </div>
          )}

          {/* Message Input */}
          <form
            onSubmit={handleSend}
            className="p-2 sm:p-4 border-t border-gray-100"
          >
            <div className="flex gap-2 sm:gap-4">
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-gray-50 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-opacity-20"
                />
                <button
                  type="button"
                  onClick={() => setIsVoiceModalOpen(true)}
                  className="px-3 bg-gray-50 rounded-xl text-gray-600 hover:text-primary-300 hover:bg-gray-100 transition-colors duration-200"
                  aria-label="Voice input"
                >
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
                      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                    />
                  </svg>
                </button>
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-primary-100 text-white rounded-xl hover:bg-primary-200 transition-colors duration-200 flex items-center gap-2"
              >
                Send
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
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>

      <VoiceInputModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onTranscript={handleVoiceTranscript}
        handleAutoclose={sendMessage}
      />
    </div>
  );
}
