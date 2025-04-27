import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RecipeCarousel({ recipes }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const isFirstSlide = currentIndex === 0;
  const isLastSlide = currentIndex === recipes.length - 1;

  const nextSlide = () => {
    if (!isLastSlide) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevSlide = () => {
    if (!isFirstSlide) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="relative w-full max-w-full sm:max-w-3xl mx-auto bg-gray-50 p-3 sm:p-6 rounded-2xl">
      <div
        className="overflow-hidden rounded-lg sm:rounded-xl shadow-lg cursor-pointer"
        onClick={() => navigate(`/recipe/${recipes[currentIndex].id}`)}
      >
        <div>
          <div className="relative bg-white flex items-center justify-center py-4 sm:py-8 hover:bg-gray-50 transition-colors duration-200">
            <div className="w-3/4 sm:w-1/2 aspect-[4/3] relative">
              <div className="relative">
                <img
                  src={recipes[currentIndex].image}
                  alt={recipes[currentIndex].recipe_name}
                  className="w-full h-full object-contain"
                />
                <div className="absolute left-2 top-2">
                  <div className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full shadow-md border border-primary-100/20">
                    <span className="text-sm font-medium bg-gradient-to-r from-primary-300 to-primary-200 bg-clip-text text-transparent">
                      {recipes[currentIndex].cuisine}
                    </span>
                  </div>
                </div>
              </div>
              <div className="absolute top-2 right-2">
                <div className="group relative">
                  {/* Tooltip */}
                  <div className="absolute invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-200 -right-2 top-16 w-48 p-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-10">
                    <div className="absolute -top-1 right-6 w-2 h-2 bg-gray-900 transform rotate-45"></div>
                    ECOBITE: Environmental Impact Score
                  </div>
                  {/* Outer ring with gradient */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-300 to-primary-200 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                  {/* Main circle */}
                  <div className="relative w-14 h-14 bg-white rounded-full flex items-center justify-center">
                    {/* Inner circle with score */}
                    <div className="w-12 h-12 bg-primary-300 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-xl">
                        {Math.floor(recipes[currentIndex].ecobiteScore / 10)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 sm:p-4">
            <h3 className="text-xl sm:text-2xl font-medium mb-1 text-gray-900">
              {recipes[currentIndex].recipe_name}
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-2">
              Serves {recipes[currentIndex].serving} •{" "}
              {recipes[currentIndex].ingredients_used.length} ingredients
            </p>
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm text-gray-500">
                {recipes[currentIndex].time}
              </span>
              <span className="text-xs sm:text-sm text-primary-100 font-medium">
                {recipes[currentIndex].date}
              </span>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={prevSlide}
        disabled={isFirstSlide}
        className={`absolute left-1 sm:left-2 top-1/3 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-white shadow-md transition-all
          ${
            isFirstSlide
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-800 hover:bg-gray-50"
          }`}
        aria-label="Previous recipe"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 sm:h-6 sm:w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        disabled={isLastSlide}
        className={`absolute right-1 sm:right-2 top-1/3 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-white shadow-md transition-all
          ${
            isLastSlide
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-800 hover:bg-gray-50"
          }`}
        aria-label="Next recipe"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 sm:h-6 sm:w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
}
