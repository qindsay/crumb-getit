import { useRef, useState } from 'react';
import Webcam from 'react-webcam';

const BACKEND_URL = 'http://127.0.0.1:5001';

function base64ToBlob(base64, mimeType = 'image/png') {
  const byteChars = atob(base64.split(',')[1]); // decode base64
  const byteNumbers = new Array(byteChars.length);
  for (let i = 0; i < byteChars.length; i++) {
      byteNumbers[i] = byteChars.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
}

function WebcamCapture({ setFilepath }) {
    const [photo, setPhoto] = useState(null); 
    const [isUploading, setIsUploading] = useState(false);

    const webcamRef = useRef(null); 
  
    const capturePhoto = () => {
      const imageSrc = webcamRef.current.getScreenshot(); 
      setPhoto(imageSrc); 
    };

    const sendPhoto = async () => {
        if (!photo) return;

        setIsUploading(true);

        try {
            const formData = new FormData();
            const blob = base64ToBlob(photo);
            formData.append('file', blob, 'captured-photo.png');

            const response = await fetch(`${BACKEND_URL}/api/use-photo`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
            // Read the body ONCE as text first.
              const errorText = await response.text();
              let errorMsg = `HTTP error ${response.status}: ${errorText}`;
              try {
                  // Try to parse the text as JSON for a more specific error message
                  const errorJson = JSON.parse(errorText);
                  errorMsg = `HTTP error ${response.status}: ${errorJson.error || errorText}`;
              } catch (parseError) {
                  // If it's not JSON, use the raw text.
              }
            throw new Error(errorMsg);
            }
            
            const data = await response.json();
            setFilepath(data['filepath'])
        
        } catch (error) {
            console.error('Error sending photo:', error);
        } finally {
            setIsUploading(false);
        }
    };
    
    // Discard photo
    const discardPhoto = () => {
        setPhoto(null);
    };
  
    return (
      <div className="webcam-container">
        {/* Webcam Feed */}
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width="80%"  // Full width
          videoConstraints={{
            facingMode: "user", // Front-facing camera for mobile
          }}
        />
        <button onClick={capturePhoto} className="capture-button">
          Capture
        </button>

        {photo && (
          <div className="photo-container">
            <h3>Your Captured Photo:</h3>
            <img src={photo} alt="Captured" className="captured-photo" />
          </div>
        )}

        {photo && (
        <div>
          <img src={photo} alt="Captured" width="200" />
          <button onClick={sendPhoto} disabled={isUploading}>
            {isUploading ? 'Uploading...' : 'Upload Photo'}
          </button>
          <button onClick={discardPhoto}>Discard Photo</button>
        </div>
      )}    

      </div>
    );
  }
  
  export default WebcamCapture;
  