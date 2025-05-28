"use client"

import { useEffect, useRef, useState } from "react"
import { Client } from "@gradio/client"
import BottomNav from "./BottomNav"

const YOLOVideoCapture = () => {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [connected, setConnected] = useState(false)
  const [error, setError] = useState(null)
  const clientRef = useRef(null)

  useEffect(() => {
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
        setError(null)
      } catch (err) {
        console.error("Error accessing webcam:", err)
        setError("Unable to access camera. Please check permissions.")
      }
    }

    startVideo()
  }, [])

  useEffect(() => {
    let isMounted = true

    const connectClientAndStartLoop = async () => {
      try {
        setLoading(true)
        clientRef.current = await Client.connect("ThesisGuitar/yolov8")
        console.log("Connected to YOLOv8")
        setConnected(true)
        setError(null)

        const captureAndPredict = async () => {
          if (!isMounted || !videoRef.current || !canvasRef.current) return

          const ctx = canvasRef.current.getContext("2d")
          const video = videoRef.current

          if (!ctx || video.videoWidth === 0 || video.videoHeight === 0) {
            setTimeout(captureAndPredict, 1000)
            return
          }

          canvasRef.current.width = video.videoWidth
          canvasRef.current.height = video.videoHeight
          ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight)

          canvasRef.current.toBlob(async (blob) => {
            if (blob && clientRef.current) {
              setLoading(true)
              try {
                const result = await clientRef.current.predict("/predict", { image: blob })
                console.log("Prediction result:", result.data)
                setResult(result.data)
                setError(null)
              } catch (err) {
                console.error("Prediction error:", err)
                setError("Prediction failed. Retrying...")
              } finally {
                setLoading(false)
              }
            }
            if (isMounted) {
              setTimeout(captureAndPredict, 7000)
            }
          }, "image/png")
        }

        setLoading(false)
        captureAndPredict()
      } catch (err) {
        console.error("Error connecting to Gradio client:", err)
        setError("Failed to connect to AI model. Please refresh the page.")
        setLoading(false)
      }
    }

    connectClientAndStartLoop()

    return () => {
      isMounted = false
    }
  }, [])

  const getChordFromResult = (result) => {
    if (!result || !result[0]) return null
    try {
      const data = result[0]
      if (data.label) {
        return data.label
      }
      return null
    } catch (err) {
      return null
    }
  }

  const detectedChord = getChordFromResult(result)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Chord Detector
          </h1>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200 p-8">
            {/* Status Indicators */}
            <div className="flex justify-center gap-4 mb-8">
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                  connected ? "bg-emerald-50 border border-emerald-200" : "bg-gray-50 border border-gray-200"
                }`}
              >
                <div
                  className={`w-3 h-3 rounded-full ${connected ? "bg-emerald-500 animate-pulse" : "bg-gray-400"}`}
                ></div>
                <span className="text-sm font-medium text-gray-700">
                  {connected ? "Model Connected" : "Connecting..."}
                </span>
              </div>

              {error && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 border border-red-200">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-sm font-medium text-red-700">Error</span>
                </div>
              )}
            </div>

            {/* Video Container */}
            <div className="relative flex justify-center mb-8">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-indigo-100 via-purple-100 to-blue-100 rounded-3xl blur-xl opacity-60"></div>
                <div className="relative bg-gray-100 rounded-2xl overflow-hidden border-2 border-gray-300 shadow-xl">
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-[320px] h-[240px] md:w-[480px] md:h-[360px] object-cover"
                    style={{
                      background: "linear-gradient(135deg, #f3f4f6, #e5e7eb)",
                      transform: "scaleX(-1)",
                    }}
                  />

                  {/* Overlay for loading state */}
                  {loading && (
                    <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center">
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                        <span className="text-indigo-700 font-semibold">Analyzing...</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <canvas ref={canvasRef} style={{ display: "none" }} />

            {/* Chord Detection Result */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
              {/* Raw Prediction Data */}
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <div className="text-sm text-gray-500 mb-3">Raw Prediction Data</div>
                <div className="bg-white rounded-xl p-4 border border-gray-200 max-h-48 overflow-auto">
                  <pre className="text-xs text-gray-700 font-mono whitespace-pre-wrap break-words">
                    {result ? JSON.stringify(result[0], null, 2) : "Waiting for prediction..."}
                  </pre>
                </div>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mt-6 bg-red-50 border border-red-200 rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-red-500 rounded-full flex-shrink-0"></div>
                  <div>
                    <div className="text-red-700 font-semibold">Error</div>
                    <div className="text-red-600 text-sm">{error}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}

export default YOLOVideoCapture
