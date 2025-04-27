import { useEffect } from "react";

export default function ReplyModal({ isOpen, onClose, message }) {
  useEffect(() => {
    if (isOpen && message) {
      const utterance = new SpeechSynthesisUtterance(message);
      
      // Try to select a British English male voice (closest to Gordon Ramsay)
      const voices = window.speechSynthesis.getVoices();
      const britishVoice = voices.find(
        (voice) =>
          voice.lang.includes("en-GB") && voice.name.toLowerCase().includes("male")
      );
      
      console.log(britishVoice)
      if (britishVoice) {
        utterance.voice = britishVoice;
      }

      utterance.pitch = 0.85;   // Normal pitch
      utterance.rate = 1.2;    // Normal speaking speed
      utterance.volume = 1;  // Max volume

      window.speechSynthesis.speak(utterance);
    }
  }, [isOpen, message]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md mx-auto flex flex-col max-h-[80vh]">
        <div className="p-6 flex-1 overflow-y-auto">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Chef's Reply</h3>
          <div className="text-gray-700 whitespace-pre-wrap">{message}</div>
        </div>
        <div className="p-4 border-t border-gray-100 bg-white rounded-b-2xl">
          <div className="flex justify-end">
            <button
              onClick={() => {
                window.speechSynthesis.cancel(); // Stop speaking if modal closes
                onClose();
              }}
              className="px-6 py-3 bg-primary-100 text-white rounded-xl hover:bg-primary-200 transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
