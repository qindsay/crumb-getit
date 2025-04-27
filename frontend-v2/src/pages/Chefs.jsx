import { chefs } from "../data/chefs";
import DetailedChefCard from "../components/DetailedChefCard";

export default function Chefs() {
  return (
    <main className="w-full pt-32 px-4">
      <div className="mx-auto max-w-[1112px] w-full">
        <h1 className="text-4xl font-medium text-gray-900 mb-8">
          Our Celebrity Chefs
        </h1>
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
          {chefs.map((chef) => (
            <DetailedChefCard key={chef.name} chef={chef} />
          ))}
        </div>
      </div>
    </main>
  );
}
