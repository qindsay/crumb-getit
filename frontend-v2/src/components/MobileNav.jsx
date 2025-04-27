import { useLocation, Link } from "react-router-dom";

export default function MobileNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 sm:hidden">
      <div className="flex justify-around items-center h-16">
        <Link
          to="/leaderboard"
          className={`flex flex-col items-center justify-center w-full h-full ${
            location.pathname === "/leaderboard"
              ? "text-primary-300"
              : "text-gray-500"
          }`}
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
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
          <span className="text-xs mt-1">Ranking</span>
        </Link>
        <Link
          to="/home"
          className={`flex flex-col items-center justify-center w-full h-full ${
            location.pathname === "/home" ? "text-primary-300" : "text-gray-500"
          }`}
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
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          <span className="text-xs mt-1">Home</span>
        </Link>

        <Link
          to="/create-recipe"
          className={`flex flex-col items-center justify-center w-full h-full ${
            location.pathname === "/create-recipe"
              ? "text-primary-300"
              : "text-gray-500"
          }`}
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span className="text-xs mt-1">Create</span>
        </Link>
      </div>
    </nav>
  );
}
