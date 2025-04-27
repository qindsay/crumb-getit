import { useNavigate } from "react-router-dom";
import { pastMeals } from "../data/pastMeals";

export default function PastMeals() {
  const navigate = useNavigate();
  const totalPoints = pastMeals.reduce(
    (sum, meal) => sum + meal.ecobiteScore,
    0,
  );

  return (
    <div className="min-h-screen w-full bg-white pb-16 sm:pb-0">
      {/* Score Block */}
      <div className="relative w-full mb-8">
        <div className="bg-gradient-to-r from-primary-300 via-primary-200 to-primary-300 px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-2 text-white">
                  Your Ecobite Score
                </h1>
                <div className="flex items-end gap-2">
                  <span className="text-5xl font-bold text-white">
                    {totalPoints.toFixed(1)}
                  </span>
                  <span className="text-xl mb-1 text-white/80">points</span>
                </div>
              </div>

              <div className="relative">
                <div className="relative">
                  <div className="absolute -inset-3 bg-white rounded-full blur opacity-75 animate-glow"></div>
                  <div className="relative w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center border border-white/40">
                    <span className="text-3xl">🌱</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-2 text-white/80">
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
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
              <span className="text-sm">Based on {pastMeals.length} meals</span>
            </div>
          </div>
        </div>
      </div>

      {/* Past Meals List */}
      <div className="w-full max-w-3xl mx-auto px-4">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Past Meals</h2>

        <div className="space-y-4">
          {pastMeals.map((meal) => (
            <div
              key={meal.id}
              onClick={() =>
                navigate(`/recipe/${meal.id}`, { state: { isCompleted: true } })
              }
              className="bg-gray-50 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-center p-4">
                <div className="w-16 h-16 flex-shrink-0">
                  <img
                    src={meal.image}
                    alt={meal.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="ml-4 flex-grow">
                  <h3 className="text-lg font-medium text-gray-900">
                    {meal.name}
                  </h3>
                  <p className="text-sm text-gray-500">{meal.date}</p>
                </div>
                <div className="flex items-center">
                  <div className="group relative ml-4">
                    {/* Tooltip */}
                    <div className="absolute invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-200 -right-2 top-8 w-48 p-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-10">
                      <div className="absolute -top-1 right-6 w-2 h-2 bg-gray-900 transform rotate-45"></div>
                      ECOBITE: Environmental Impact Score
                    </div>
                    {/* Score Badge */}
                    <div className="relative">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-300 to-primary-200 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                      <div className="relative w-12 h-12 bg-white rounded-full flex items-center justify-center">
                        <div className="w-10 h-10 bg-primary-300 rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-white font-bold text-sm">
                            {meal.ecobiteScore}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
