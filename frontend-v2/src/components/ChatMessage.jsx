export default function ChatMessage({ message, isChef, chefAvatar }) {
  return (
    <div
      className={`flex gap-2 sm:gap-4 mb-4 ${isChef ? "" : "flex-row-reverse"}`}
    >
      <div className="w-10 h-10 sm:w-14 sm:h-14 flex-shrink-0">
        {isChef ? (
          <div className="w-full h-full bg-gray-50 rounded-full p-1">
            <img
              src={chefAvatar}
              alt="Chef"
              className="w-full h-full rounded-full object-contain"
            />
          </div>
        ) : (
          <div className="w-full h-full bg-primary-100 rounded-full flex items-center justify-center text-white text-sm sm:text-lg font-medium">
            You
          </div>
        )}
      </div>
      <div className={`flex-1 ${isChef ? "pr-2 sm:pr-12" : "pl-2 sm:pl-12"}`}>
        <div
          className={`p-3 sm:p-4 rounded-2xl ${
            isChef
              ? "bg-gray-50 rounded-tl-none"
              : "bg-primary-50 rounded-tr-none"
          }`}
        >
          <p className="text-gray-800 text-sm sm:text-base">{message}</p>
        </div>
      </div>
    </div>
  );
}
