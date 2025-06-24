"use client"

import { useEffect, useRef, useState } from "react"
import { Client } from "@gradio/client"
import BottomNav from "./BottomNav"
import { PitchDetector } from 'pitchy'




const CHORD_IMAGES = [
  { name: "A", img: "achord.png" },
  { name: "Am", img: "amchord.png" },
  { name: "Bm", img: "bminorchord.png" },
  { name: "C", img: "cchord.png" },
  { name: "D", img: "dchord.png" },
  { name: "Dm", img: "dminor.png" },
  { name: "E", img: "e.png" },
  { name: "Em", img: "em.png" },
  { name: "F", img: "f.png" },
  { name: "Fm", img: "fm.png" },
  { name: "G", img: "g.png" },
]


const ChordSoundModal = ({
  open,
  step,
  countdown,
  detectedChord,
  rawYoloLabel,
  tunerChord,
  onClose,
  isRecording,
  error,
}) => {
  if (!open) return null


  const yoloChordImg = detectedChord
    ? CHORD_IMAGES.find((c) => c.name.toLowerCase() === detectedChord.toLowerCase())
    : null

  const isSameChord =
    detectedChord &&
    tunerChord &&
    detectedChord.toLowerCase() === tunerChord.toLowerCase()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full relative flex flex-col items-center">
        {step === "prepare" && (
          <>
            <div className="text-2xl font-bold mb-2 text-indigo-700">Get Ready!</div>
            <div className="mb-4 text-gray-700">Preparing to record chord sound...</div>
            <div className="text-5xl font-bold text-indigo-500 mb-2">{countdown}</div>
          </>
        )}
        {step === "record" && (
          <>
            <div className="text-2xl font-bold mb-2 text-green-700">Recording...</div>
            <div className="mb-4 text-gray-700">Play the chord now!</div>
            <div className="text-5xl font-bold text-green-500 mb-2">{countdown}</div>
            <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse mb-2"></div>
          </>
        )}
        {step === "result" && (
          <>
            <div className="text-2xl font-bold mb-2 text-indigo-700">Detected Chord</div>
            <div className="mb-2 text-gray-700">
              <div>
  <span className="font-semibold">From Camera: </span>
  {detectedChord ? (
    <span className="text-indigo-600 font-bold">{detectedChord}</span>
  ) : rawYoloLabel ? (
    <span className="text-yellow-600 font-bold">{rawYoloLabel}</span>
  ) : (
    <span className="text-red-500">No chord detected</span>
  )}
</div>
              <div>
                <span className="font-semibold">From Tuner: </span>
                {tunerChord ? (
                  <span className="text-green-600 font-bold">{tunerChord}</span>
                ) : (
                  <span className="text-gray-400">No chord detected</span>
                )}
              </div>
            </div>
            {detectedChord && tunerChord && !isSameChord && (
              <div className="my-3 text-center">
                <div className="text-red-600 font-semibold mb-2">
                  Chords do not match!
                </div>
                {yoloChordImg && (
                  <img
                    src={`/${yoloChordImg.img}`}
                    alt={detectedChord}
                    className="mx-auto rounded shadow max-h-40"
                  />
                )}
                <div className="text-xs text-gray-500 mt-2">
                  Camera detected: <b>{detectedChord}</b>
                </div>
              </div>
            )}
            {detectedChord && tunerChord && isSameChord && (
              <div className="my-3 text-center">
                <div className="text-emerald-600 font-semibold mb-2">
                  Chords match!
                </div>
              </div>
            )}
            <button
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </>
        )}
        {step === "error" && (
          <>
            <div className="text-2xl font-bold mb-2 text-red-700">Error</div>
            <div className="mb-4 text-gray-700">{error || "Something went wrong."}</div>
            <button
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg"
              onClick={onClose}
            >
              Close
            </button>
          </>
        )}
      </div>
    </div>
  )
}

const YOLOVideoCapture = () => {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [connected, setConnected] = useState(false)
  const [error, setError] = useState(null)
  const clientRef = useRef(null)
  

  const [modalOpen, setModalOpen] = useState(false)
  const [modalStep, setModalStep] = useState("prepare") 
  const [modalCountdown, setModalCountdown] = useState(4)
  const [soundChord, setSoundChord] = useState(null)
  const [isRecording, setIsRecording] = useState(false)
  const [audioChunks, setAudioChunks] = useState([])
  const mediaRecorderRef = useRef(null)
  const [detectedChord, setDetectedChord] = useState(null)
const [rawYoloLabel, setRawYoloLabel] = useState(null)
  


  const [refreshTimeout, setRefreshTimeout] = useState(null)

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
    let stopCapture = false 

    const connectClientAndStartLoop = async () => {
      try {
        setLoading(true)
        clientRef.current = await Client.connect("ThesisGuitar/yolov8")
        setConnected(true)
        setError(null)

        const captureAndPredict = async () => {
         
          if (!isMounted || !videoRef.current || !canvasRef.current || modalOpen) return

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
                setResult(result.data)
                console.log(result.data[0])
                getChordFromResult(result.data[0])
                setError(null)
              } catch (err) {
                setError("Prediction failed. Retrying...")
              } finally {
                setLoading(false)
              }
            }
      
            if (isMounted && !modalOpen) {
              setTimeout(captureAndPredict, 7000)
            }
          }, "image/png")
        }

        setLoading(false)
        captureAndPredict()
      } catch (err) {
        setError("Failed to connect to AI model. Please refresh the page.")
        setLoading(false)
      }
    }

    connectClientAndStartLoop()

    return () => {
      isMounted = false
      stopCapture = true
    }
  }, [modalOpen])
  

 
  const YOLO_CHORD_MAP = {
    "A MAJOR CHORD": "A",
    "A MINOR CHORD": "Am",
    "B MINOR CHORD": "Bm",
    "CMAJOR CHORD": "C",
    "D MAJOR CHORD": "D",
    "D MINOR CHORD": "Dm",
    "E MAJOR CHORD": "E",
    "E MINOR CHORD": "Em",
    "F MAJOR CHORD": "F",
    "F SHARP MINOR CHORD": "Fm", 
    "G MAJOR CHORD": "G",
  }



const getChordFromResult = (result) => {
  const raw = result
  const normalizedLabel = raw.trim().toUpperCase()
  const mapped = YOLO_CHORD_MAP[normalizedLabel] || null

  console.log("Raw label:", raw)
  console.log("Normalized label:", normalizedLabel)
  console.log("Mapped chord:", mapped)

 setDetectedChord(mapped);
}




  useEffect(() => {
    if (result && !modalOpen) {
 
      const t = setTimeout(() => {
        setModalOpen(true)
        setModalStep("prepare")
        setModalCountdown(4)
        setSoundChord(null)
      }, 4000)
      return () => clearTimeout(t)
    }
  }, [result, modalOpen])


  useEffect(() => {
    if (!modalOpen) return

    if (modalStep === "prepare" && modalCountdown > 0) {
      const t = setTimeout(() => setModalCountdown((c) => c - 1), 1000)
      return () => clearTimeout(t)
    }
    if (modalStep === "prepare" && modalCountdown === 0) {
      setModalStep("record")
      setModalCountdown(4)
      setIsRecording(true)
    }
    if (modalStep === "record" && modalCountdown > 0) {
      if (!isRecording) setIsRecording(true)
      const t = setTimeout(() => setModalCountdown((c) => c - 1), 1000)
      return () => clearTimeout(t)
    }
    if (modalStep === "record" && modalCountdown === 0) {
      setIsRecording(false)
      setModalStep("result")
      setModalCountdown(4)
    }
    if (modalStep === "result" && modalCountdown > 0) {
      const t = setTimeout(() => setModalCountdown((c) => c - 1), 1000)
      return () => clearTimeout(t)
    }
  }, [modalOpen, modalStep, modalCountdown])


  useEffect(() => {
    if (isRecording) {
 
      let chunks = []
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        const mediaRecorder = new window.MediaRecorder(stream)
        mediaRecorderRef.current = mediaRecorder
        mediaRecorder.start()

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            chunks.push(e.data)
          }
        }
   mediaRecorder.onstop = async () => {
    
  const audioBlob = new Blob(chunks, { type: "audio/webm" })
  const arrayBuffer = await audioBlob.arrayBuffer()
  const audioContext = new AudioContext()
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
  const pcmData = audioBuffer.getChannelData(0)

  const windowSize = 2048
  const hopSize = 1024
  const notes = []
  const detector = PitchDetector.forFloat32Array(windowSize)
  for (let i = 0; i < pcmData.length - windowSize; i += hopSize) {
    const segment = pcmData.slice(i, i + windowSize)
    const [pitch, clarity] = detector.findPitch(segment, audioContext.sampleRate)
    if (clarity > 0.8 && pitch > 50 && pitch < 1200) {
      const note = pitchToNote(pitch)
      notes.push(note)
    }
  }

  const noteCounts = notes.reduce((acc, n) => {
    acc[n] = (acc[n] || 0) + 1
    return acc
  }, {})
  const sortedNotes = Object.entries(noteCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([note]) => note)
  const topNotes = sortedNotes.slice(0, 3)

  console.log('All detected notes:', notes)
  console.log('Top notes:', topNotes)

  const chord = guessChordFromNotes(topNotes)
  setSoundChord(chord || "Unknown")
  stream.getTracks().forEach((track) => track.stop())
}

const pitchToNote = (frequency) => {
  if (!frequency || isNaN(frequency)) return null
  const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
  const A4 = 440
  const semitone = 69 + 12 * Math.log2(frequency / A4)
  const index = Math.round(semitone)
  return NOTES[(index + 12) % 12]
}

const guessChordFromNotes = (notes) => {
  if (!notes || notes.length === 0) return null
  const CHORD_PATTERNS = {
    A: ["A", "C#", "E"],
    Am: ["A", "C", "E"],
    Bm: ["B", "D", "F#"],
    C: ["C", "E", "G"],
    D: ["D", "F#", "A"],
    Dm: ["D", "F", "A"],
    E: ["E", "G#", "B"],
    Em: ["E", "G", "B"],
    F: ["F", "A", "C"],
    Fm: ["F", "G#", "C"],
    G: ["G", "B", "D"],
  }
  for (const chord in CHORD_PATTERNS) {
    const pattern = CHORD_PATTERNS[chord]
    if (pattern.every((n) => notes.includes(n))) {
      return chord
    }
  }
  for (const chord in CHORD_PATTERNS) {
    const pattern = CHORD_PATTERNS[chord]
    const matchCount = pattern.filter((n) => notes.includes(n)).length
    if (matchCount >= 2) {
      return chord
    }
  }
  return null
}




        setAudioChunks(chunks)
        setTimeout(() => {
          mediaRecorder.stop()
        }, 4000)
      })
    }
  }, [isRecording])


  useEffect(() => {
    return () => {
      if (refreshTimeout) clearTimeout(refreshTimeout)
    }
  }, [refreshTimeout])

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

      {/* Chord Sound Modal */}
     <ChordSoundModal
  open={modalOpen}
  step={modalStep}
  countdown={modalCountdown}
  detectedChord={detectedChord}
  rawYoloLabel={rawYoloLabel}
  tunerChord={soundChord}
  onClose={() => setModalOpen(false)}
  isRecording={isRecording}
  error={error}
/>
      <BottomNav />
    </div>
  )
}

export default YOLOVideoCapture