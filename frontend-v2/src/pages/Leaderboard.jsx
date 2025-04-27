import { currentUserId, leaderboardData } from "../data/leaderboard";

import { pastMeals } from "../data/pastMeals";

export default function Leaderboard() {
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
                    <span className="text-4xl">🌱</span>
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

      <div className="w-full max-w-3xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-primary-300 mb-8">
          Leaderboard
        </h1>

        <div className="space-y-4">
          {leaderboardData.map((user) => {
            const isCurrentUser = user.id === currentUserId;
            const isTopThree = user.rank <= 3;

            return (
              <div
                key={user.id}
                className={`transform transition-all duration-300 ${
                  isCurrentUser
                    ? "bg-primary-50 scale-105 shadow-lg border-2 border-primary-300"
                    : "bg-gray-50 hover:scale-102 shadow-sm"
                } rounded-xl overflow-hidden`}
              >
                <div className="p-4 flex items-center gap-4">
                  {/* Rank */}
                  <div
                    className={`w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center text-2xl font-bold
                    ${
                      isTopThree
                        ? "bg-gradient-to-br from-primary-300 to-primary-200 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {user.rank}
                  </div>

                  {/* Avatar and Name */}
                  <div className="flex-grow flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xl">
                      {user.avatar}
                    </div>
                    <div>
                      <h3
                        className={`font-medium ${isCurrentUser ? "text-primary-300" : "text-gray-900"}`}
                      >
                        {user.name}
                      </h3>
                      {isCurrentUser && (
                        <span className="text-sm text-primary-200">You</span>
                      )}
                    </div>
                  </div>

                  {/* Score */}
                  <div className="group relative">
                    {/* Tooltip */}
                    <div className="absolute invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-200 -right-2 top-8 w-48 p-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-10">
                      <div className="absolute -top-1 right-6 w-2 h-2 bg-gray-900 transform rotate-45"></div>
                      ECOBITE: Environmental Impact Score
                    </div>
                    {/* Score Badge */}
                    <div className="relative">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-300 to-primary-200 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                      <div className="relative w-16 h-16 bg-white rounded-full flex items-center justify-center">
                        <div className="w-14 h-14 bg-primary-300 rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-white font-bold">
                            {user.score.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
