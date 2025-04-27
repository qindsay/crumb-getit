import { useState } from "react";
import { Link } from "react-router-dom";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function toggleMenu() {
    setIsMenuOpen(!isMenuOpen);
  }

  return (
    <header className="fixed w-full backdrop-blur bg-white bg-opacity-90 shadow-[0_1px_3px_rgba(0,0,0,0.1)] z-[100]">
      <div className="flex justify-between items-center p-4 mx-auto my-0 max-w-[1112px]">
        <Link
          to="/"
          className="text-3xl font-bold text-primary-100 no-underline"
        >
          crumbgetit
        </Link>
        <nav
          className={`flex gap-8 ${
            isMenuOpen
              ? "sm:flex flex-col absolute top-full left-0 right-0 bg-white p-4"
              : "hidden sm:flex"
          }`}
        >
          <Link
            to="/features"
            className="text-base font-medium no-underline text-gray-900 hover:text-primary-100"
          >
            Features
          </Link>
          <Link
            to="/chefs"
            className="text-base font-medium no-underline text-gray-900 hover:text-primary-100"
          >
            Chefs
          </Link>
        </nav>
        <button
          className="p-2 bg-transparent cursor-pointer border-none text-gray-900 sm:hidden"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          Menu
        </button>
      </div>
    </header>
  );
}
