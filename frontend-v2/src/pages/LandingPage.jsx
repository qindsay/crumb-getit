import { chefs } from "../data/chefs";
import { useNavigate } from "react-router-dom";
import ChefCard from "../components/ChefCard";

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <main className="min-w-screen w-full">
      <section className="pt-32 pb-20 text-center w-full">
        <div className="px-4 mx-auto max-w-[1112px] w-full">
          <h1 className="mb-6 text-6xl font-medium leading-tight text-gray-900 max-sm:text-4xl">
            <span>Your AI-Powered</span>
            <br />
            <span>Personal Chef Assistant</span>
          </h1>
          <p className="mx-auto mt-0 mb-10 text-xl leading-relaxed max-w-[600px] text-gray-600">
            Turn your ingredients into delicious recipes with help from
            world-renowned chefs. Snap a photo, speak, or type - and let AI do
            the cooking magic.
          </p>
          <div className="flex gap-4 justify-center max-sm:flex-col">
            <button
              onClick={() => navigate("/signin")}
              className="px-6 py-3 text-base font-medium bg-primary-100 rounded-lg cursor-pointer border-none duration-200 text-white transition-colors hover:bg-primary-200"
            >
              Get Started
            </button>
            <button className="px-6 py-3 text-base font-medium text-primary-100 rounded-lg border border-primary-100 border-solid cursor-pointer bg-transparent duration-200 transition-colors hover:bg-primary-100 hover:text-white">
              Watch Demo
            </button>
          </div>
        </div>
      </section>
      <section className="w-full px-0 py-20 bg-gray-50 w-full">
        <div className="px-4 mx-auto max-w-[1112px] w-full">
          <h2 className="mb-12 text-4xl font-medium text-center text-gray-900">
            Meet Your Celebrity Chef Assistants
          </h2>
          <div className="grid gap-8 mb-12 grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
            {chefs.map((chef) => (
              <ChefCard key={chef.name} chef={chef} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
