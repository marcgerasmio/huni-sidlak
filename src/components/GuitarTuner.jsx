"use client"

import { useEffect, useRef, useState } from "react"
import { PitchDetector } from "pitchy"
import BottomNav from "./BottomNav"

const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]

const FLAT_TO_SHARP = {
  Bb: "A#",
  Db: "C#",
  Eb: "D#",
  Gb: "F#",
  Ab: "G#",
}

const TUNING_PRESETS = {
  Standard: ["E2", "A2", "D3", "G3", "B3", "E4"],
  "Half-Step Down": ["Eb2", "Ab2", "Db3", "Gb3", "Bb3", "Eb4"],
  "Drop D": ["D2", "A2", "D3", "G3", "B3", "E4"],
  "Open E": ["E2", "B2", "E3", "G#3", "B3", "E4"],
  DADGAD: ["D2", "A2", "D3", "G3", "A3", "D4"],
}

const frequencyToNote = (frequency) => {
  const A4 = 440
  const noteNumber = 12 * Math.log2(frequency / A4) + 69
  const roundedNote = Math.round(noteNumber)
  const noteIndex = (roundedNote + 12) % 12
  const octave = Math.floor(roundedNote / 12) - 1
  return `${NOTES[noteIndex]}${octave}`
}

const noteToFrequency = (note) => {
  const A4 = 440
  let noteName = note.slice(0, -1)
  const octave = Number.parseInt(note.slice(-1))

  if (FLAT_TO_SHARP[noteName]) {
    noteName = FLAT_TO_SHARP[noteName]
  }
  const noteIndex = NOTES.indexOf(noteName)
  if (noteIndex === -1) return null
  const noteNumber = noteIndex + (octave + 1) * 12
  return A4 * Math.pow(2, (noteNumber - 69) / 12)
}

const findClosestString = (frequency, currentTuning) => {
  if (!frequency) return null

  const detectedNote = frequencyToNote(frequency)
  const noteName = detectedNote.slice(0, -1)
  const octave = Number.parseInt(detectedNote.slice(-1))

  let closestString = currentTuning[0]
  let minDifference = Number.POSITIVE_INFINITY

  currentTuning.forEach((string) => {
    const stringFreq = noteToFrequency(string)
    const difference = Math.abs(frequency - stringFreq)
    if (difference < minDifference) {
      minDifference = difference
      closestString = string
    }
  })

  return closestString
}

const smoothingFactor = 0.2

const Gauge = ({ cents = 0 }) => {
  const clamped = Math.max(-30, Math.min(30, cents))
  const angle = (clamped / 30) * 60

  return (
    <div className="flex justify-center mb-8">
      <div className="relative">
        <svg width="280" height="140" viewBox="0 0 280 140" className="drop-shadow-lg">
          <defs>
            <radialGradient id="gaugeGlow" cx="50%" cy="100%" r="50%">
              <stop offset="0%" stopColor="rgba(99, 102, 241, 0.1)" />
              <stop offset="100%" stopColor="rgba(99, 102, 241, 0)" />
            </radialGradient>
            <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#e5e7eb" />
              <stop offset="50%" stopColor="#d1d5db" />
              <stop offset="100%" stopColor="#e5e7eb" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background glow */}
          <ellipse cx="140" cy="140" rx="120" ry="60" fill="url(#gaugeGlow)" />

          {/* Arc background */}
          <path
            d="M30,140 A110,110 0 0,1 250,140"
            fill="none"
            stroke="url(#arcGradient)"
            strokeWidth="12"
            strokeLinecap="round"
          />

          {/* Tick marks and labels */}
          {[...Array(7)].map((_, i) => {
            const val = -30 + i * 10
            const theta = ((val + 30) / 60) * Math.PI
            const x1 = 140 + 95 * Math.cos(Math.PI - theta)
            const y1 = 140 - 95 * Math.sin(Math.PI - theta)
            const x2 = 140 + 105 * Math.cos(Math.PI - theta)
            const y2 = 140 - 105 * Math.sin(Math.PI - theta)
            const isCenter = val === 0

            return (
              <g key={val}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={isCenter ? "#059669" : "#6b7280"}
                  strokeWidth={isCenter ? "3" : "2"}
                  filter={isCenter ? "url(#glow)" : "none"}
                />
                <text
                  x={140 + 80 * Math.cos(Math.PI - theta)}
                  y={140 - 80 * Math.sin(Math.PI - theta) + 6}
                  textAnchor="middle"
                  fontSize="14"
                  fontWeight={isCenter ? "bold" : "normal"}
                  fill={isCenter ? "#059669" : "#6b7280"}
                  filter={isCenter ? "url(#glow)" : "none"}
                >
                  {val === 0 ? "0" : val > 0 ? `+${val}` : val}
                </text>
              </g>
            )
          })}

          {/* Needle */}
          <g>
            <line
              x1="140"
              y1="140"
              x2={140 + 85 * Math.sin((-angle * Math.PI) / 180)}
              y2={140 - 85 * Math.cos((-angle * Math.PI) / 180)}
              stroke={Math.abs(clamped) < 5 ? "#059669" : "#dc2626"}
              strokeWidth="4"
              strokeLinecap="round"
              filter="url(#glow)"
              className="transition-all duration-300 ease-out"
            />
            <circle
              cx="140"
              cy="140"
              r="8"
              fill="#f9fafb"
              stroke={Math.abs(clamped) < 5 ? "#059669" : "#dc2626"}
              strokeWidth="3"
              filter="url(#glow)"
              className="transition-all duration-300 ease-out"
            />
          </g>
        </svg>
      </div>
    </div>
  )
}

const GuitarTuner = () => {
  const [note, setNote] = useState(null)
  const [frequency, setFrequency] = useState(null)
  const [smoothedFrequency, setSmoothedFrequency] = useState(null)
  const [targetString, setTargetString] = useState(null)
  const [tuningProgress, setTuningProgress] = useState(0)
  const [isInTune, setIsInTune] = useState(false)
  const [tuningStatus, setTuningStatus] = useState({ direction: "none", cents: 0 })
  const [selectedTuning, setSelectedTuning] = useState("Standard")
  const [manualString, setManualString] = useState("")
  const audioRef = useRef(null)

  useEffect(() => {
    if (!smoothedFrequency || !targetString) {
      setTuningStatus({ direction: "none", cents: 0 })
      return
    }
    const targetFreq = noteToFrequency(targetString)
    const cents = 1200 * Math.log2(smoothedFrequency / targetFreq)
    const isPerfect = Math.abs(cents) < 5
    setIsInTune(isPerfect)
    setTuningStatus({
      direction: isPerfect ? "perfect" : cents > 0 ? "high" : "low",
      cents,
    })
  }, [smoothedFrequency, targetString])

  useEffect(() => {
    if (isInTune && targetString) {
      const currentIndex = TUNING_PRESETS[selectedTuning].indexOf(targetString)
      if (currentIndex < TUNING_PRESETS[selectedTuning].length - 1) {
        setTuningProgress(currentIndex + 1)
      }
    }
  }, [isInTune, targetString, selectedTuning])

  useEffect(() => {
    setTuningProgress(0)
    setTargetString(null)
    setNote(null)
    setFrequency(null)
    setSmoothedFrequency(null)
  }, [selectedTuning])

  useEffect(() => {
    let audioCtx, stream, source, workletNode
    let detector

    const initAudio = async () => {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      audioCtx = new (window.AudioContext || window.webkitAudioContext)()
      await audioCtx.audioWorklet.addModule("/pitch-processor.js")

      source = audioCtx.createMediaStreamSource(stream)
      workletNode = new window.AudioWorkletNode(audioCtx, "pitch-processor")

      detector = PitchDetector.forFloat32Array(2048)

      workletNode.port.onmessage = (event) => {
        const input = event.data
        const [pitch, clarity] = detector.findPitch(input, audioCtx.sampleRate)

        if (clarity > 0.95 && pitch > 50) {
          const detectedNote = frequencyToNote(pitch)
          setNote(detectedNote)
          setFrequency(pitch)
          setSmoothedFrequency((prev) => (prev ? prev * (1 - smoothingFactor) + pitch * smoothingFactor : pitch))
          const closestString = findClosestString(pitch, TUNING_PRESETS[selectedTuning])
          if (closestString) {
            setTargetString(closestString)
          }
        }
      }

      source.connect(workletNode)
      audioRef.current = { audioCtx, stream, workletNode }
    }

    initAudio()

    return () => {
      if (audioRef.current) {
        const { audioCtx, stream, workletNode } = audioRef.current
        stream.getTracks().forEach((track) => track.stop())
        workletNode.disconnect()
        audioCtx.close()
      }
    }
  }, [selectedTuning])

  useEffect(() => {
    if (manualString) {
      setTargetString(manualString)
    } else if (smoothedFrequency) {
      const closestString = findClosestString(smoothedFrequency, TUNING_PRESETS[selectedTuning])
      if (closestString) setTargetString(closestString)
    }
  }, [manualString, smoothedFrequency, selectedTuning])

  const targetFreq = targetString ? noteToFrequency(targetString) : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Guitar Tuner
          </h1>
        </div>

        {/* Main Tuner Card */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200 p-8 mb-8">
            {/* Gauge */}
            <Gauge cents={tuningStatus.cents} />

      
            {/* Tuning Status */}
            <div className="flex justify-center mb-8">
              <div
                className={`px-8 py-4 rounded-2xl font-bold text-xl transition-all duration-500 transform ${
                  isInTune
                    ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/25 scale-105"
                    : "bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 shadow-lg"
                }`}
              >
                {isInTune ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-white rounded-full animate-pulse"></span>
                    Perfect Tune!
                  </span>
                ) : (
                  <span>
                    {tuningStatus.direction === "high"
                      ? "Too Sharp"
                      : tuningStatus.direction === "low"
                        ? "Too Flat"
                        : "🎸 Play a string to tune"}
                  </span>
                )}
              </div>
            </div>

            {/* String Indicators */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {TUNING_PRESETS[selectedTuning].map((string, idx) => (
                <div
                  key={string}
                  className={`relative p-4 rounded-xl border-2 font-bold text-center transition-all duration-300 transform ${
                    targetString === string
                      ? "bg-gradient-to-br from-indigo-500 to-blue-500 border-indigo-400 text-white shadow-lg shadow-indigo-500/25 scale-105"
                      : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <div className="text-lg font-bold">{string}</div>
                  <div className="text-xs text-white-500 mt-1">String {idx + 1}</div>
                  {targetString === string && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full animate-pulse"></div>
                  )}
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}

export default GuitarTuner
