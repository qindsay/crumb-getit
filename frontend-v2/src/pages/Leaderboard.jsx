import { currentUserId, leaderboardData } from "../data/leaderboard";

export default function Leaderboard() {
  return (
    <div className="min-h-screen w-full bg-white pb-16 sm:pb-0">
      <div className="w-full max-w-3xl mx-auto px-4 pt-6">
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
