import { useState, useCallback } from "react";
import WebcamModal from "../components/WebcamModal";
import { useNavigate } from "react-router-dom";
const BACKEND_URL = "http://127.0.0.1:5001"; // Use http://localhost:5001 if 127.0.0.1 doesn't work

export default function CreateRecipe() {
  const [ingredients, setIngredients] = useState([]);
  const [cuisine, setCuisine] = useState("");
  const [isWebcamOpen, setIsWebcamOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCameraClick = () => {
    setIsWebcamOpen(true);
  };

  const handleCapture = useCallback((imageSrc) => {
    setCapturedImage(imageSrc);
    setIsLoading(true);
    setIngredients([]);

    /*setTimeout(() => {
      setIngredients(
        "2 tomatoes\n1 onion\n3 cloves of garlic\n1 bell pepper\nfresh basil",
      );
      setIsLoading(false);
    }, 3000);*/
  }, []);

  const navigate = useNavigate();

  
  const handleNext = async () => {
    try {
      console.log(JSON.stringify({
        ingredients: ingredients,
        cuisine: cuisine,
      }));
      const response = await fetch(`${BACKEND_URL}/api/generate-recipe`, {
        method: 'POST', // or 'GET', depending on your API
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ingredients: ingredients,
          cuisine: cuisine,
        })
      });
  
      if (!response.ok) {
        throw new Error('Failed to generate recipe');
      }
  
      const data = await response.json(); // if you want the result
      console.log('Recipe generated:', data);
  
      navigate('/recipe/1', {state: {recipe: data}});
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white pb-16 sm:pb-0">
      <div className="max-w-4xl mx-auto px-4 pt-8 pb-20">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Create Your Recipe
          </h1>
          <p className="text-gray-600 text-lg">
            Let's turn your ingredients into something delicious
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-gray-50 rounded-3xl p-8 shadow-lg">
          {/* Input Methods */}
          <div className="space-y-4 mb-8">
            <button
              onClick={handleCameraClick}
              className="group relative w-full overflow-hidden rounded-2xl bg-white p-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border border-gray-100"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-100/20 to-transparent rounded-bl-full transform transition-transform group-hover:scale-110" />
              <div className="relative flex items-center gap-6">
                <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary-300 text-white transform transition-transform group-hover:scale-110">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-8"
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
                <div className="text-left">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Snap Ingredients
                  </h3>
                  <p className="text-gray-600">
                    Take a photo of your ingredients
                  </p>
                </div>
              </div>
            </button>

            {/* Cuisine Input */}
            <div>
              <label
                htmlFor="cuisine"
                className="block text-lg font-medium text-gray-900 mb-2"
              >
                Cuisine Type
              </label>
              <input
                type="text"
                id="cuisine"
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value)}
                placeholder="Enter cuisine type (e.g., Italian, Japanese, etc.)"
                className="w-full px-6 py-4 text-base bg-white text-gray-900 rounded-xl border border-gray-200 hover:border-primary-300 focus:border-primary-300 focus:ring-2 focus:ring-primary-300 focus:ring-opacity-20 focus:outline-none transition-all duration-200 placeholder-gray-400"
              />
            </div>
          </div>

          {/* Text Input */}
          <div className="mb-8 relative">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Your Ingredients
              </h3>
              <p className="text-sm text-gray-600">
                Type or modify the detected ingredients below
              </p>
            </div>
            <textarea
              value={ingredients.map(i => `${i.amount || ''} ${i.unit || ''} ${i.name || ''}`.trim()).join('\n')}
              onChange={(e) => {
                const lines = e.target.value.split('\n');
                const newIngredients = lines.map(line => {
                  const parts = line.trim().match(/^([\d./\s]*)\s*([a-zA-Z]*)\s*(.*)$/);
                  // Basic parsing, might need refinement
                  return {
                    amount: parts?.[1]?.trim() || '',
                    unit: parts?.[2]?.trim() || '',
                    name: parts?.[3]?.trim() || ''
                  };
                }).filter(i => i.name); // Filter out empty lines
                setIngredients(newIngredients);
              }}
              rows={ingredients.length + 1}
              placeholder="Enter your ingredients..."
              disabled={isLoading}
              className={`w-full px-6 py-4 text-lg bg-white text-gray-900 rounded-xl border ${
                isLoading
                  ? "border-gray-200"
                  : "border-gray-200 hover:border-primary-300"
              } focus:border-primary-300 focus:ring-2 focus:ring-primary-300 focus:ring-opacity-20 focus:outline-none transition-all duration-200 resize-none placeholder-gray-400`}
              rows={6}
            />
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-95 rounded-xl backdrop-blur-sm">
                <div className="flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-lg">
                  <svg
                    className="animate-spin h-5 w-5 text-primary-300"
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
                  <span className="text-gray-900 font-medium">
                    Detecting ingredients...
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Next Button */}
          <button
            onClick={handleNext}
            disabled={isLoading}
            className={`w-full flex items-center justify-center gap-2 px-8 py-4 text-lg font-medium rounded-xl transition-all duration-300 ${
              isLoading
                ? "bg-gray-200 cursor-not-allowed"
                : "bg-primary-300 hover:bg-primary-200 hover:shadow-lg hover:scale-[1.02]"
            } text-white`}
          >
            Create Recipe
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

      <WebcamModal
        isOpen={isWebcamOpen}
        onClose={() => setIsWebcamOpen(false)}
        onCapture={handleCapture}
      />
    </div>
  );
}
