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
  const [isCreating, setIsCreating] = useState(false);

  const handleCameraClick = () => {
    setIsWebcamOpen(true);
  };

  const handleCapture = useCallback(async (imageSrc) => {
    setCapturedImage(imageSrc);
    setIsLoading(true);
    setIngredients([]);

    try {
      const response = await fetch(`${BACKEND_URL}/api/recognize-ingredients`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: imageSrc,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to recognize ingredients");
      }

      const data = await response.json();
      const ingredientStrings = data.ingredients.split("\n");

      // Parse each ingredient string into object format
      const parsedIngredients = ingredientStrings
        .map((str) => {
          // Match pattern: ingredient followed by number followed by optional unit
          const match = str.match(/^(.*?)\s+(\d+(?:\.\d+)?)\s*(.*)$/);
          if (match) {
            const [_, name, amount, unit] = match;
            return {
              name: name.trim(),
              amount: amount.trim(),
              unit: unit.trim(),
            };
          }
          return null;
        })
        .filter(Boolean); // Remove any null results

      console.log("Parsed ingredients:", parsedIngredients);
      setIngredients(parsedIngredients);
    } catch (error) {
      console.error("Error recognizing ingredients:", error);
      setIngredients([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const navigate = useNavigate();

  const transformIngredients = useCallback((ingredients) => {
    return ingredients
      .map((ing) => {
        const parts = [ing.amount, ing.unit, ing.name]
          .filter(Boolean) // Remove empty strings
          .join(" ")
          .trim();
        return parts;
      })
      .filter(Boolean); // Remove any empty strings after joining
  }, []);

  const handleNext = async () => {
    setIsCreating(true);
    try {
      const transformedIngredients = transformIngredients(ingredients);
      const response = await fetch(`${BACKEND_URL}/api/generate-recipe`, {
        method: "POST", // or 'GET', depending on your API
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ingredients: transformedIngredients,
          cuisine: cuisine,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate recipe");
      }

      const data = await response.json(); // if you want the result
      console.log("Recipe generated:", data);

      navigate("/recipe/1", { state: { recipe: data } });
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsCreating(false);
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
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                      Ingredient
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                      Unit
                    </th>
                    <th className="px-6 py-3 w-16"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {ingredients.map((ingredient, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          value={ingredient.name}
                          onChange={(e) => {
                            const newIngredients = [...ingredients];
                            newIngredients[index] = {
                              ...ingredient,
                              name: e.target.value,
                            };
                            setIngredients(newIngredients);
                          }}
                          placeholder="Enter ingredient"
                          disabled={isLoading || isCreating}
                          className="w-full bg-transparent border-0 focus:ring-0 p-0 text-gray-900 placeholder-gray-400"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          value={ingredient.amount}
                          onChange={(e) => {
                            const newIngredients = [...ingredients];
                            newIngredients[index] = {
                              ...ingredient,
                              amount: e.target.value,
                            };
                            setIngredients(newIngredients);
                          }}
                          placeholder="Amount"
                          disabled={isLoading || isCreating}
                          className="w-full bg-transparent border-0 focus:ring-0 p-0 text-gray-900 placeholder-gray-400"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          value={ingredient.unit}
                          onChange={(e) => {
                            const newIngredients = [...ingredients];
                            newIngredients[index] = {
                              ...ingredient,
                              unit: e.target.value,
                            };
                            setIngredients(newIngredients);
                          }}
                          placeholder="Unit"
                          disabled={isLoading || isCreating}
                          className="w-full bg-transparent border-0 focus:ring-0 p-0 text-gray-900 placeholder-gray-400"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => {
                            const newIngredients = ingredients.filter(
                              (_, i) => i !== index,
                            );
                            setIngredients(newIngredients);
                          }}
                          disabled={isLoading || isCreating}
                          className="p-1.5 rounded-lg bg-gray-50 hover:bg-red-50 text-gray-500 hover:text-red-500 transition-all duration-200"
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
                              strokeWidth={1.5}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setIngredients([
                      ...ingredients,
                      { name: "", amount: "", unit: "" },
                    ]);
                  }}
                  disabled={isLoading || isCreating}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
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
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Add Ingredient
                </button>
              </div>
            </div>
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
            disabled={isLoading || isCreating}
            className={`w-full flex items-center justify-center gap-2 px-8 py-4 text-lg font-medium rounded-xl transition-all duration-300 ${
              isLoading || isCreating
                ? "bg-gray-200 cursor-not-allowed opacity-60"
                : "bg-primary-300 hover:bg-primary-200 hover:shadow-lg hover:scale-[1.02]"
            } text-white`}
          >
            {isCreating ? (
              <>
                Creating Recipe
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
            ) : (
              <>
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
    </div>
  );
}
