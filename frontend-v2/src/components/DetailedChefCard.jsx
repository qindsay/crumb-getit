export default function DetailedChefCard({ chef }) {
  return (
    <div className="p-6 bg-gray-50 rounded-xl transition-all duration-300 ease-in-out hover:scale-105 hover:bg-primary-50 hover:shadow-xl focus:scale-105 focus:bg-primary-50 focus:shadow-xl focus:outline-none cursor-pointer">
      <img
        src={`/src/assets/${chef.name.replace(/\s+/g, "_")}.png`}
        alt={`${chef.name} avatar`}
        className="mx-auto mb-4 w-24 h-24 p-1 rounded-full object-contain bg-white"
      />
      <h2 className="text-2xl font-medium text-gray-900 mb-2">{chef.name}</h2>
      <h3 className="text-lg text-primary-100 mb-2">{chef.specialty}</h3>
      <p className="text-gray-600">{chef.description}</p>
    </div>
  );
}
