import { useState } from "react";

export default function InputMethods() {
  const [ingredients, setIngredients] = useState("");

  const handleMicrophoneClick = () => {
    // TODO: Implement voice input
    console.log("Microphone clicked");
  };

  const handleCameraClick = () => {
    // TODO: Implement camera input
    console.log("Camera clicked");
  };

  return (
    <div className="w-full max-w-2xl">
      <div className="relative">
        <input
          type="text"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          placeholder="Enter your ingredients..."
          className="w-full px-6 py-4 text-lg text-gray-900 rounded-xl border border-gray-200 focus:border-primary-100 focus:ring-2 focus:ring-primary-100 focus:ring-opacity-20 focus:outline-none transition-all duration-200"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
          <button
            onClick={handleMicrophoneClick}
            className="p-3 text-gray-600 hover:text-primary-100 hover:bg-primary-50 rounded-lg transition-all duration-200"
            aria-label="Voice input"
          >
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
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
              />
            </svg>
          </button>
          <button
            onClick={handleCameraClick}
            className="p-3 text-gray-600 hover:text-primary-100 hover:bg-primary-50 rounded-lg transition-all duration-200"
            aria-label="Camera input"
          >
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
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
            </svg>
          </button>
        </div>
      </div>
      <p className="mt-3 text-sm text-gray-600 text-center">
        Speak, snap, or type your ingredients to get started
      </p>
    </div>
  );
}
