import React, { useState, useRef, useCallback,useContext } from 'react';
import Webcam from 'react-webcam';
import { Button } from 'react-bootstrap';
import { uploadDocument } from '../services/user';
import UserContext from '../store/AuthContext';
import { useNavigate } from 'react-router-dom';

const Uploaddoc = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [webcamOpen, setWebcamOpen] = useState(false);
  const webcamRef = useRef(null);
  const { userState:{email}} = useContext(UserContext)
  const navigate=useNavigate()

  const submit = async () => {
    try {
      if(selectedImage)
      {
        const formData = new FormData();
        formData.append('image', selectedImage);
        formData.append('email', email);
    
        const resp = await uploadDocument(formData);
        console.log(resp);
        if(resp.success){
          navigate('/takeselfie')
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      setSelectedImage(event.target.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const captureImage = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setSelectedImage(imageSrc);
    setWebcamOpen(false)
  }, []);

  console.log(selectedImage)

  const clearImages = () => {
    setSelectedImage(null);
    setWebcamOpen(false)
  };

  return (
    <div>
      {/* Button to open file dialog */}
      <button>
        Select Image
        <input type="file" accept="image/*" onChange={handleImageSelect} />
      </button>

      {/* Preview selected image */}
      {selectedImage && (
        <div>
          <img style={{maxWidth:'600px'}} src={selectedImage} alt="Selected" />
        </div>
      )}

      {/* Button to open webcam */}
      {!webcamOpen && (
        <button onClick={() => {setWebcamOpen(true)
        setSelectedImage(null)}}>Open Webcam</button>
      )}

      {/* Webcam preview */}
      {webcamOpen && !selectedImage && (
        <div>
            <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            />
            <button onClick={captureImage}>Capture</button>
            <button onClick={clearImages}>Cancel</button>
        </div>
        )}
        <div style={{marginTop:'20px'}}>
          <Button onClick={submit}>Continue</Button>
        </div>
    </div>
  );
};

export default Uploaddoc;
