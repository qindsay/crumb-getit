import { useState, useRef, useEffect } from "react";

export default function CuisineFilters({
  cuisineTypes,
  selectedCuisine,
  onSelect,
}) {
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(false);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const checkScroll = () => {
      const container = scrollContainerRef.current;
      if (container) {
        setShowLeftScroll(container.scrollLeft > 0);
        setShowRightScroll(
          container.scrollLeft < container.scrollWidth - container.clientWidth,
        );
      }
    };

    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({
        left: direction * 200,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative w-full mb-6 sm:mb-8 -mx-4 sm:mx-0 px-4 sm:px-0">
      {showLeftScroll && (
        <button
          onClick={() => scroll(-1)}
          className="absolute left-4 sm:left-0 top-1/2 -translate-y-1/2 z-10 p-1.5 sm:p-2 rounded-full bg-white shadow-md text-gray-800 hover:bg-gray-50"
          aria-label="Scroll left"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 sm:h-5 sm:w-5"
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
      )}

      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto scrollbar-hide gap-2 px-6 sm:px-8"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {cuisineTypes.map((cuisine) => (
          <button
            key={cuisine}
            onClick={() => onSelect(cuisine)}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base rounded-full whitespace-nowrap transition-colors duration-200 flex-shrink-0
              ${
                selectedCuisine === cuisine
                  ? "bg-primary-100 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
          >
            {cuisine}
          </button>
        ))}
      </div>

      {showRightScroll && (
        <button
          onClick={() => scroll(1)}
          className="absolute right-4 sm:right-0 top-1/2 -translate-y-1/2 z-10 p-1.5 sm:p-2 rounded-full bg-white shadow-md text-gray-800 hover:bg-gray-50"
          aria-label="Scroll right"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 sm:h-5 sm:w-5"
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
      )}
    </div>
  );
}
