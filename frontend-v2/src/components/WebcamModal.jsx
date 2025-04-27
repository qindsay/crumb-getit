import Webcam from "react-webcam";
import { useCallback, useRef } from "react";

export default function WebcamModal({ isOpen, onClose, onCapture }) {
  const webcamRef = useRef(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    onCapture(imageSrc);
    onClose();
  }, [webcamRef, onCapture, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl mx-auto">
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Take a Photo of Your Dish
          </h3>
          <div className="relative aspect-video mb-4">
            <Webcam
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="w-full rounded-lg"
            />
          </div>
          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={capture}
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
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Capture Photo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
