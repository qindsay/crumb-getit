import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
const BACKEND_URL = "http://127.0.0.1:5001";
import RecipeCarousel from "../components/RecipeCarousel";
import FilterCarousel from "../components/FilterCarousel";

export default function Home() {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [allRecipes, setAllRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/get-recipes`);
        if (!response.ok) {
          throw new Error("Failed to fetch recipes");
        }
        const data = await response.json();
        setAllRecipes(data);
      } catch (err) {
        console.error("Error fetching recipes:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  // Generate unique cuisine filters from recipes
  const filterCategories = useMemo(() => {
    const uniqueCuisines = [
      ...new Set(allRecipes.map((recipe) => recipe.cuisine)),
    ].filter(Boolean);
    return ["All", ...uniqueCuisines.sort()];
  }, [allRecipes]);

  // Filter recipes based on selected cuisine
  const filteredRecipes = useMemo(() => {
    if (selectedFilter === "All") {
      return allRecipes;
    }
    return allRecipes.filter((recipe) => recipe.cuisine === selectedFilter);
  }, [selectedFilter, allRecipes]);

  return (
    <div className="min-h-screen w-full bg-white overflow-x-hidden pb-16 sm:pb-0">
      <div className="w-full max-w-[1112px] mx-auto px-4 pt-8 sm:pt-16">
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary-300">
            Hello!
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
            <RecipeCarousel recipes={filteredRecipes} />
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
