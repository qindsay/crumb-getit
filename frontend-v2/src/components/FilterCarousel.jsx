import { useState, useRef, useEffect } from "react";

export default function FilterCarousel({ filters, selectedFilter, onSelect }) {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  const checkScroll = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
    }
  };

  const scroll = (direction) => {
    if (containerRef.current) {
      const scrollAmount = containerRef.current.clientWidth * 0.8;
      containerRef.current.scrollBy({
        left: direction * scrollAmount,
        behavior: "smooth",
      });
      setTimeout(checkScroll, 400);
    }
  };

  return (
    <div className="relative w-full max-w-[calc(100vw-2rem)] sm:max-w-3xl mx-auto">
      <div className="flex items-center">
        {canScrollLeft && (
          <button
            onClick={() => scroll(-1)}
            className="absolute left-0 z-10 p-2 rounded-full bg-white shadow-md text-gray-800 hover:bg-gray-50"
            aria-label="Scroll left"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
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
          ref={containerRef}
          className="w-full overflow-x-auto scrollbar-hide px-8"
          style={{
            maxWidth: "calc(100% - 16px)",
            WebkitOverflowScrolling: "touch",
          }}
          onScroll={checkScroll}
        >
          <div className="inline-flex gap-2 w-max">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => onSelect(filter)}
                className={`px-4 py-1 rounded-full text-sm whitespace-nowrap transition-colors duration-200 flex-shrink-0
                  ${
                    selectedFilter === filter
                      ? "bg-primary-200 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {canScrollRight && (
          <button
            onClick={() => scroll(1)}
            className="absolute right-0 z-10 p-2 rounded-full bg-white shadow-md text-gray-800 hover:bg-gray-50"
            aria-label="Scroll right"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
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
    </div>
  );
}
