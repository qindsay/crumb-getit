import { useState, useCallback } from "react";
import VoiceInputModal from "../components/VoiceInputModal";
import { useNavigate } from "react-router-dom";

export default function CreateRecipe() {
  const [ingredients, setIngredients] = useState("");

  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  const handleMicrophoneClick = () => {
    setIsVoiceModalOpen(true);
  };

  const handleVoiceTranscript = useCallback((transcript) => {
    setIngredients(transcript);
  }, []);

  const handleCameraClick = () => {
    setIngredients((prev) => prev + " tomatoes, onions, garlic");
  };

  const navigate = useNavigate();

  const handleNext = () => {
    // In a real app, we would first save the ingredients
    // For now, navigate directly to the recipe detail
    navigate("/recipe/1");
  };

  return (
    <div className="min-h-screen w-full bg-white pb-16 sm:pb-0 flex flex-col items-center">
      <h1 className="text-xl font-medium text-gray-900 mt-6 mb-8">
        Create Recipe
      </h1>

      <div className="w-full px-4 flex-1 flex items-center justify-center">
        <div className="w-full max-w-3xl bg-gray-50 rounded-3xl p-8">
          {/* Input Methods */}
          <div className="grid grid-cols-1 gap-8 mb-8">
            <button
              onClick={handleCameraClick}
              className="w-full flex flex-col items-center gap-3 p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border-2 border-transparent hover:border-primary-300"
            >
              <div className="w-20 h-20 flex items-center justify-center rounded-full bg-primary-300 text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-10 h-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                </svg>
              </div>
              <span className="text-sm font-medium text-primary-300">
                Camera Input
              </span>
            </button>
          </div>

          {/* Text Input */}
          <div className="mb-6">
            <textarea
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="Enter your ingredients..."
              className="w-full px-4 py-3 text-base bg-white rounded-xl border-2 border-gray-200 focus:border-primary-300 focus:ring-2 focus:ring-primary-300 focus:ring-opacity-20 focus:outline-none transition-all duration-200 resize-none"
              rows={2}
            />
          </div>

          {/* Next Button */}
          <button
            onClick={handleNext}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 text-lg font-medium bg-primary-300 text-white rounded-xl hover:bg-primary-200 transition-colors duration-200"
          >
            Next
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>
        </div>
      </div>
      <VoiceInputModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onTranscript={handleVoiceTranscript}
      />
    </div>
  );
}
