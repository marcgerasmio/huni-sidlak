import React, { useEffect, useRef, useState } from "react";
import { Client } from "@gradio/client";
import BottomNav from './BottomNav';


const YOLOVideoCapture = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const clientRef = useRef(null);

  // Setup webcam stream on mount
  useEffect(() => {
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing webcam:", err);
      }
    };

    startVideo();
  }, []);

  // Connect to YOLOv8 model and start loop
  useEffect(() => {
    let isMounted = true;

    const connectClientAndStartLoop = async () => {
      try {
        // Connect once
        clientRef.current = await Client.connect("ThesisGuitar/yolov8");
        console.log("Connected to YOLOv8");

        const captureAndPredict = async () => {
          if (!isMounted || !videoRef.current || !canvasRef.current) return;

          const ctx = canvasRef.current.getContext("2d");
          const video = videoRef.current;

          if (!ctx || video.videoWidth === 0 || video.videoHeight === 0) {
            setTimeout(captureAndPredict, 1000);
            return;
          }

          canvasRef.current.width = video.videoWidth;
          canvasRef.current.height = video.videoHeight;
          ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

          canvasRef.current.toBlob(async (blob) => {
            if (blob && clientRef.current) {
              setLoading(true);
              try {
                const result = await clientRef.current.predict("/predict", { image: blob });
                console.log("Prediction result:", result.data);
                setResult(result.data);
              } catch (err) {
                console.error("Prediction error:", err);
              } finally {
                setLoading(false);
              }
            }
            if (isMounted) {
              setTimeout(captureAndPredict, 7000);
            }
          }, "image/png");
        };

        captureAndPredict();
      } catch (err) {
        console.error("Error connecting to Gradio client:", err);
      }
    };

    connectClientAndStartLoop();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl font-bold text-white mb-8 text-center mt-5">Chord Detector</h1>
      <div className="bg-gray-700 backdrop-blur-lg text-white rounded-3xl shadow-2xl p-8 w-full max-w-2xl flex flex-col items-center border border-cyan-900 relative">
        <div className="relative w-full flex flex-col items-center">
          <div className="rounded-2xl overflow-hidden border-4 border-cyan-700 shadow-lg bg-black/80 mb-6">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-[320px] h-[240px] md:w-[400px] md:h-[300px] object-cover"
              style={{ background: "#0a2327", transform: "scaleX(-1)"  }}
            />
          </div>
          <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>

        {loading && (
          <div className="mt-6 flex flex-col items-center">
            <div className="w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mb-2"></div>
            <span className="text-cyan-200 font-semibold animate-pulse">Processing...</span>
          </div>
        )}

        {/* Always show the prediction result box, even if result is null */}
        <div className="mt-6 w-full bg-white/80 text-black p-4 rounded-xl shadow-inner text-base font-mono overflow-auto max-h-60 min-h-[80px]">
          <strong className="block text-cyan-700 mb-2">Prediction Result:</strong>
          <pre className="whitespace-pre-wrap break-words">
            {result ? JSON.stringify(result[0], null, 2) : "Waiting for prediction..."}
          </pre>
        </div>
    </div>
    <BottomNav />
    </div>
  );
};

export default YOLOVideoCapture;
