export default function ChefCard({ chef }) {
  return (
    <div className="p-6 text-center rounded-xl bg-gray-50 transition-all duration-300 ease-in-out hover:scale-105 hover:bg-primary-50 hover:shadow-xl focus:scale-105 focus:bg-primary-50 focus:shadow-xl focus:outline-none cursor-pointer">
      <img
        src={`/src/assets/${chef.name.replace(/\s+/g, "_")}.png`}
        alt={`${chef.name} avatar`}
        className="mx-auto mt-0 mb-4 w-24 h-24 p-1 rounded-full object-contain bg-white"
      />
      <h3 className="mb-2 text-xl font-medium text-gray-900">{chef.name}</h3>
      <p className="text-sm text-gray-600">{chef.shortDescription}</p>
    </div>
  );
}
