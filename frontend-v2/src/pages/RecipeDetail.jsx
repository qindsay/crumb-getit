import { useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { recipeDetail } from "../data/recipeDetails";
import InstructionBlock from "../components/InstructionBlock";

export default function RecipeDetail() {
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState(null);
  const location = useLocation();
  const [buttonState, setButtonState] = useState(
    location.state?.isCompleted ? "completed" : "initial",
  );

  const handleExpand = (instructionId) => {
    setExpandedId(expandedId === instructionId ? null : instructionId);
  };

  const handleComplete = useCallback(() => {
    if (buttonState !== "initial") return;

    setButtonState("loading");

    // Simulate API call with delay
    setTimeout(() => {
      setButtonState("completed");
    }, 2000);
  }, [buttonState]);

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
            {recipeDetail.name}
          </h1>
          <div className="flex justify-between items-center">
            <p className="text-gray-600 font-medium">{recipeDetail.time}</p>
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
                  {recipeDetail.ingredients.length} items
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
                {recipeDetail.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-primary-300 rounded-full mr-3 opacity-75"></span>
                    {ingredient}
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
            {recipeDetail.instructions.map((instruction) => (
              <InstructionBlock
                key={instruction.id}
                instruction={instruction}
                isExpanded={expandedId === instruction.id}
                onToggle={() => handleExpand(instruction.id)}
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
    </div>
  );
}
