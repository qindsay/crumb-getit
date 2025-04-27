import { useRef, useState } from 'react';
import Webcam from 'react-webcam';


const BACKEND_URL = 'http://127.0.0.1:5001';

function WebcamCapture() {
    const [photo, setPhoto] = useState(null); 
    const [isUploading, setIsUploading] = useState(false);

    const webcamRef = useRef(null); 
  
    const capturePhoto = () => {
      const imageSrc = webcamRef.current.getScreenshot(); 
      setPhoto(imageSrc); 
    };

    // const savePhoto = () => {
    //     if (photo) {
    //       // Create a link to download the image
    //       const link = document.createElement('a');
    //       link.href = photo;
    //       link.download = 'captured-photo.png'; // You can change the name or format as needed
    //       link.click();
    //     }
    const sendPhoto = async () => {
        if (!photo) return;

        setIsUploading(true);

        try {
            const formData = new FormData();
            const blob = await fetch(photo).then(res => res.blob());
            formData.append('file', blob, 'captured-photo.png');

            const response = await fetch(`${BACKEND_URL}/api/send-photo`, {
                method: 'POST',
                body: formData,
                mode: 'no-cors'
            });

            if (response.ok) {
                alert('Photo sent successfully!');
            } else {
                alert('Error sending photo.');
            }
        } catch (error) {
            console.error('Error sending photo:', error);
            alert('Error sending photo.');
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
  