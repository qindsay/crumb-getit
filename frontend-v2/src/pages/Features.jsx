export default function Features() {
  return (
    <main className="pt-32 px-4 max-w-[1080px] mx-auto">
      <h1 className="text-4xl font-medium text-sky-50 mb-8">Features</h1>
      <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <div className="p-6 bg-slate-800 rounded-xl">
          <h2 className="text-2xl font-medium text-sky-50 mb-4">
            AI Recipe Generation
          </h2>
          <p className="text-slate-400">
            Transform your available ingredients into delicious recipes with
            AI-powered suggestions.
          </p>
        </div>
        <div className="p-6 bg-slate-800 rounded-xl">
          <h2 className="text-2xl font-medium text-sky-50 mb-4">
            Voice Commands
          </h2>
          <p className="text-slate-400">
            Cook hands-free with voice-activated recipe instructions and timers.
          </p>
        </div>
        <div className="p-6 bg-slate-800 rounded-xl">
          <h2 className="text-2xl font-medium text-sky-50 mb-4">
            Smart Shopping Lists
          </h2>
          <p className="text-slate-400">
            Automatically generate shopping lists based on your selected
            recipes.
          </p>
        </div>
      </div>
    </main>
  );
}
