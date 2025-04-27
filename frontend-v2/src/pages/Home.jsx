import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { recipes, filterCategories } from "../data/recipes";
import RecipeCarousel from "../components/RecipeCarousel";
import FilterCarousel from "../components/FilterCarousel";

export default function Home() {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState("All");

  return (
    <div className="min-h-screen w-full bg-white overflow-x-hidden pb-16 sm:pb-0">
      <div className="w-full max-w-[1112px] mx-auto px-4 pt-8 sm:pt-16">
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary-300">
            Hello, Name
          </h1>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">My Recipes</h2>

        <div className="mb-6">
          <FilterCarousel
            filters={filterCategories}
            selectedFilter={selectedFilter}
            onSelect={setSelectedFilter}
          />
        </div>

        <div className="relative">
          <div className="mb-8 sm:mb-12">
            <RecipeCarousel recipes={recipes} />
          </div>

          <button
            onClick={() => navigate("/create-recipe")}
            className="absolute left-1/2 -translate-x-1/2 -bottom-6 w-14 h-14 flex items-center justify-center bg-primary-200 text-white rounded-full hover:bg-primary-300 transition-colors duration-200 shadow-lg"
            aria-label="Create new recipe"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
