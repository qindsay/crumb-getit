import { useEffect, useState, useRef } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

export default function VoiceInputModal({ isOpen, onClose, onTranscript, handleAutoclose }) {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const [lastTranscript, setLastTranscript] = useState("");
  const silenceTimer = useRef(null);

  useEffect(() => {
    let timer;
    if (isOpen) {
      SpeechRecognition.startListening({ continuous: true });
    } else {
      SpeechRecognition.stopListening();
    }
    return () => {
      if (silenceTimer.current) {
        clearTimeout(silenceTimer.current);
      }
      SpeechRecognition.stopListening();
    };
  }, [isOpen]);

  // Check for new words and reset silence timer
  useEffect(() => {
    if (listening && transcript !== lastTranscript) {
      setLastTranscript(transcript);
      console.log("New words detected:", transcript);

      // Clear existing timer
      if (silenceTimer.current) {
        clearTimeout(silenceTimer.current);
      }

      // Set new timer
      silenceTimer.current = setTimeout(() => {
        console.log("No new words for 5 seconds, stopping...");
        handleStop();
        handleAutoclose(transcript);
      }, 5000);
    }
  }, [transcript, listening]);

  if (!browserSupportsSpeechRecognition) {
    return null;
  }

  const handleStop = () => {
    if (silenceTimer.current) {
      clearTimeout(silenceTimer.current);
    }
    SpeechRecognition.stopListening();
    onTranscript(transcript);
    onClose();
    resetTranscript();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
        <div className="text-center mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Voice Input</h3>
          <p className="text-gray-600">
            {listening
              ? "Listening... Will stop after 5 seconds of silence"
              : "Press start to begin recording"}
          </p>
        </div>

        <div className="flex justify-center gap-4">
          {listening ? (
            <button
              onClick={handleStop}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-300 text-white rounded-xl hover:bg-primary-200 transition-colors duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
                />
              </svg>
              Stop Recording
            </button>
          ) : (
            <button
              onClick={() =>
                SpeechRecognition.startListening({ continuous: true })
              }
              className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-300 text-white rounded-xl hover:bg-primary-200 transition-colors duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
              Start Recording
            </button>
          )}

          <button
            onClick={onClose}
            className="px-6 py-3 text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
