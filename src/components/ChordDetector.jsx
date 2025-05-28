import { useState, useEffect, useRef } from 'react';
import { Camera, ZoomIn } from 'lucide-react';

export default function ChordDetector() {
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedChord, setDetectedChord] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [debugImage, setDebugImage] = useState(null);
  const [showDebug, setShowDebug] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [availableCameras, setAvailableCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState('');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const frameIntervalRef = useRef(null);
  const [isVideoReady, setIsVideoReady] = useState(false);

  // Initialize canvas element
  useEffect(() => {
    if (!canvasRef.current) {
      console.log('Creating canvas element...');
      const canvas = document.createElement('canvas');
      canvas.style.display = 'none'; // Hide the canvas element
      document.body.appendChild(canvas);
      canvasRef.current = canvas;
    }

    // Cleanup function
    return () => {
      if (canvasRef.current) {
        document.body.removeChild(canvasRef.current);
        canvasRef.current = null;
      }
    };
  }, []);

  // Check available cameras on component mount
  useEffect(() => {
    const checkCameras = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        console.log('Available cameras:', videoDevices);
        setAvailableCameras(videoDevices);
        if (videoDevices.length > 0) {
          setSelectedCamera(videoDevices[0].deviceId);
        }
      } catch (err) {
        console.error('Error checking cameras:', err);
        setCameraError('Could not enumerate cameras: ' + err.message);
      }
    };
    checkCameras();
  }, []);

  // Handle video element mount
  const handleVideoRef = (element) => {
    videoRef.current = element;
    if (element && streamRef.current) {
      element.srcObject = streamRef.current;
      element.onloadedmetadata = () => {
        element.play()
          .then(() => {
            console.log('Video playback started successfully');
            setIsVideoReady(true);
            startFrameCapture();
          })
          .catch(playError => {
            console.error('Error starting video playback:', playError);
            setCameraError('Error starting video: ' + playError.message);
          });
      };
    }
  };

  const startDetection = async () => {
    try {
      console.log('Starting camera detection...');
      stopDetection(); // Stop any existing stream first
      
      // Configure camera constraints
      let constraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };
      
      // Use selected camera if available
      if (selectedCamera) {
        constraints.video.deviceId = { exact: selectedCamera };
      } else {
        // Try to use back camera as fallback
        constraints.video.facingMode = { ideal: 'environment' };
      }

      console.log('Attempting to access camera with constraints:', constraints);
      let stream;
      
      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        console.log('Successfully accessed camera');
      } catch (cameraError) {
        console.error('Specific camera access failed:', cameraError);
        
        // Fall back to any available camera
        console.log('Trying fallback with simple constraints...');
        constraints = { video: true, audio: false };
        
        try {
          stream = await navigator.mediaDevices.getUserMedia(constraints);
          console.log('Successfully accessed camera with fallback constraints');
        } catch (fallbackError) {
          console.error('All camera access attempts failed:', fallbackError);
          throw fallbackError;
        }
      }

      // Store the stream reference for later cleanup
      streamRef.current = stream;
      setIsVideoReady(false);
      setIsDetecting(true);
      setCameraError('');
      
    } catch (err) {
      console.error("Error accessing camera:", err);
      let errorMessage = "Camera access denied";
      
      if (err.name === 'NotReadableError') {
        errorMessage = "Camera is in use by another application. Please close other applications using the camera.";
      } else if (err.name === 'NotFoundError') {
        errorMessage = "No camera found. Please connect a camera and try again.";
      } else if (err.name === 'NotAllowedError') {
        errorMessage = "Camera access was denied. Please allow camera access in your browser settings.";
      } else if (err.name === 'OverconstrainedError') {
        errorMessage = "Camera does not support the requested resolution. Trying with default settings...";
      }
      
      setCameraError(errorMessage);
      setDetectedChord('');
      stopDetection();
    }
  };

  const stopDetection = () => {
    if (frameIntervalRef.current) {
      clearInterval(frameIntervalRef.current);
      frameIntervalRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
        console.log('Track stopped:', track.label);
      });
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current.pause();
    }

    setIsDetecting(false);
    setDetectedChord('');
    setConfidence(0);
    setDebugImage(null);
  };

  const startFrameCapture = () => {
    if (!videoRef.current || !canvasRef.current) {
      console.error('Video or canvas reference not found');
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Ensure we're capturing frames only after video is ready
    if (video.readyState !== video.HAVE_ENOUGH_DATA) {
      console.log('Video not ready yet, waiting for data...');
      
      // Wait for video to be ready
      const checkVideoReady = () => {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
          console.log('Video ready, starting frame capture');
          startActualFrameCapture();
        } else {
          setTimeout(checkVideoReady, 100);
        }
      };
      
      checkVideoReady();
      return;
    }
    
    startActualFrameCapture();
    
    function startActualFrameCapture() {
      // Clear any existing interval
      if (frameIntervalRef.current) {
        clearInterval(frameIntervalRef.current);
      }

      let isProcessing = false; // Flag to prevent overlapping requests
      let lastProcessedTime = 0;
      const MIN_INTERVAL = 100; // Minimum time between processing frames (ms)

      frameIntervalRef.current = setInterval(async () => {
        const now = Date.now();
        
        // Skip if we're still processing the previous frame or if not enough time has passed
        if (isProcessing || (now - lastProcessedTime) < MIN_INTERVAL) {
          return;
        }

        try {
          isProcessing = true;
          lastProcessedTime = now;

          if (video.readyState === video.HAVE_ENOUGH_DATA) {
            console.log('Capturing frame...');
            
            // Set canvas dimensions to match video
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
            // Draw the current video frame to the canvas
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            console.log(`Frame captured. Dimensions: ${canvas.width}x${canvas.height}`);
            
            // Convert canvas to blob
            const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.8));
            console.log('Frame converted to blob:', blob.size, 'bytes');
            
            // Create form data
            const formData = new FormData();
            formData.append('file', blob, 'frame.jpg');

            console.log('Sending frame to backend...');
            // Send frame to backend
            const response = await fetch('http://localhost:8000/process-frame', {
              method: 'POST',
              body: formData,
            });

            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Received response from backend:', data);
            
            if (data.error) {
              console.error('Backend error:', data.error);
              setDetectedChord('Error: ' + data.error);
              return;
            }
            
            if (data.chord) {
              console.log('Setting new chord:', data.chord, 'with confidence:', data.confidence);
              setDetectedChord(data.chord);
              setConfidence(data.confidence || 0);
              if (data.debug_image) {
                setDebugImage(data.debug_image);
              }
            } else {
              console.log('No chord detected in response');
            }
          } else {
            console.log('Video not ready, current state:', video.readyState);
          }
        } catch (error) {
          console.error('Error processing frame:', error);
          setDetectedChord('Error: ' + error.message);
        } finally {
          isProcessing = false;
        }
      }, 50); // Check every 50ms, but process at most every 100ms
    }
  };

  // Add a cleanup effect for the frame capture
  useEffect(() => {
    return () => {
      if (frameIntervalRef.current) {
        clearInterval(frameIntervalRef.current);
        frameIntervalRef.current = null;
      }
    };
  }, []);

  // Handle camera selection change
  const handleCameraChange = (e) => {
    setSelectedCamera(e.target.value);
  };

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      stopDetection();
    };
  }, []);

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto bg-gray-100 p-4 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Guitar Chord Detector</h2>

      <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden mb-4">
        {isDetecting ? (
          <video
            ref={handleVideoRef}
            className="w-full h-full object-cover"
            autoPlay
            playsInline
            muted
            style={{ transform: 'scaleX(-1)' }} // Mirror the video for selfie view
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Camera size={64} className="text-gray-400" />
            <p className="text-gray-400 ml-2">Camera feed will appear here</p>
          </div>
        )}
      </div>

      {cameraError && (
        <div className="w-full mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {cameraError}
        </div>
      )}

      {availableCameras.length > 0 && (
        <div className="w-full mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Select Camera:
          </label>
          <select
            className="w-full p-2 border border-gray-300 rounded-lg"
            value={selectedCamera}
            onChange={handleCameraChange}
            disabled={isDetecting}
          >
            {availableCameras.map((camera, index) => (
              <option key={camera.deviceId} value={camera.deviceId}>
                {camera.label || `Camera ${index + 1}`}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex justify-center mb-4 space-x-4">
        {!isDetecting ? (
          <button
            onClick={startDetection}
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg flex items-center"
          >
            <Camera size={20} className="mr-2" />
            Start Detection
          </button>
        ) : (
          <button
            onClick={stopDetection}
            className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg"
          >
            Stop Detection
          </button>
        )}

        <button
          onClick={() => setShowDebug(!showDebug)}
          className={`${showDebug ? 'bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'} text-white py-2 px-4 rounded-lg flex items-center`}
          disabled={!debugImage}
        >
          <ZoomIn size={20} className="mr-2" />
          {showDebug ? "Hide Debug" : "Show Debug"}
        </button>
      </div>

      {isDetecting && (
        <div className="w-full bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xl font-bold">Detected Chord:</h3>
            <div className="text-3xl font-bold text-blue-700">
              {detectedChord || 'Waiting for detection...'}
            </div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
            <div
              className={`h-4 rounded-full transition-all duration-300 ${
                confidence > 80 ? 'bg-green-600' : 
                confidence > 60 ? 'bg-yellow-500' : 
                'bg-red-500'
              }`}
              style={{ width: `${confidence}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 text-center">
            Confidence: {confidence}%
            {!detectedChord && ' (Waiting for first detection...)'}
          </p>
        </div>
      )}

      {showDebug && debugImage && (
        <div className="mt-4 w-full">
          <h3 className="text-lg font-semibold mb-2">Debug View</h3>
          <div className="bg-white p-2 rounded-lg shadow">
            <img
              src={`data:image/png;base64,${debugImage}`}
              alt="Debug visualization"
              className="w-full rounded"
            />
            <p className="text-xs text-gray-600 mt-1">
              Green box: detected fretboard area | Yellow lines: strings | Pink lines: frets | Red dots: detected finger positions
            </p>
          </div>
        </div>
      )}

      <div className="mt-4 w-full">
        <h3 className="text-lg font-semibold mb-2">Troubleshooting Tips</h3>
        <ul className="list-disc list-inside text-sm text-gray-700 bg-blue-50 p-4 rounded-lg">
          <li>Make sure your camera is not being used by another application</li>
          <li>If using HTTPS, ensure you've granted camera permissions</li>
          <li>Try selecting different cameras if available</li>
          <li>Ensure the backend API is running at <code className="bg-gray-200 p-1 rounded">http://localhost:8000</code></li>
        </ul>
      </div>
    </div>
  );
}