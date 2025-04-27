import { useState } from "react";

export default function InputMethods() {
  const [ingredients, setIngredients] = useState("");

  const handleCameraClick = () => {
    // TODO: Implement camera input
    console.log("Camera clicked");
  };

  return (
    <div className="w-full px-4">
      <div className="relative max-w-[1112px] mx-auto">
        <input
          type="text"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          placeholder="Enter your ingredients..."
          className="w-full px-6 py-4 text-lg bg-slate-800 text-sky-50 rounded-xl border border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-20 focus:outline-none transition-all duration-200 placeholder:text-slate-400"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
          <button
            onClick={handleCameraClick}
            className="p-3 text-slate-400 hover:text-indigo-400 hover:bg-slate-700 rounded-lg transition-all duration-200"
            aria-label="Camera input"
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
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
            </svg>
          </button>
        </div>
      </div>
      <p className="mt-3 text-sm text-slate-400 text-center">
        Snap a photo or type your ingredients to get started
      </p>
    </div>
  );
}
