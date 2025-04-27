export default function InstructionBlock({
  instruction,
  stepNumber,
  isExpanded,
  onToggle,
}) {
  if (!instruction) return null;

  return (
    <div className="mb-4">
      <button
        onClick={onToggle}
        className="w-full bg-gray-50 rounded-xl p-4 text-left hover:bg-gray-100 transition-colors duration-200"
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 pr-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Step {stepNumber}
            </h3>
            <p className="text-sm text-gray-600">{instruction.instruction}</p>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-5 h-5 text-gray-500 transition-transform duration-200 flex-shrink-0 ${
              isExpanded ? "transform rotate-180" : ""
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

      {isExpanded && (
        <div className="mt-4 bg-white rounded-xl p-6 shadow-lg">
          <div className="aspect-video bg-gray-200 rounded-lg">
            {/* Video placeholder - would be replaced with actual video */}
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-12 h-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
