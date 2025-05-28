import React, { useEffect, useRef, useState } from 'react';
import { PitchDetector } from 'pitchy';
import BottomNav from './BottomNav';

const NOTES = [
  'C', 'C#', 'D', 'D#', 'E', 'F',
  'F#', 'G', 'G#', 'A', 'A#', 'B'
];

const FLAT_TO_SHARP = {
  'Bb': 'A#',
  'Db': 'C#',
  'Eb': 'D#',
  'Gb': 'F#',
  'Ab': 'G#'
};

const TUNING_PRESETS = {
  'Standard': ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'],
  'Half-Step Down': ['Eb2', 'Ab2', 'Db3', 'Gb3', 'Bb3', 'Eb4'],
  'Drop D': ['D2', 'A2', 'D3', 'G3', 'B3', 'E4'],
  'Open E': ['E2', 'B2', 'E3', 'G#3', 'B3', 'E4'],
  'DADGAD': ['D2', 'A2', 'D3', 'G3', 'A3', 'D4']
};

const frequencyToNote = (frequency) => {
  const A4 = 440;
  const noteNumber = 12 * (Math.log2(frequency / A4)) + 69;
  const roundedNote = Math.round(noteNumber);
  const noteIndex = (roundedNote + 12) % 12;
  const octave = Math.floor(roundedNote / 12) - 1;
  return `${NOTES[noteIndex]}${octave}`;
};

const noteToFrequency = (note) => {
  const A4 = 440;
  let noteName = note.slice(0, -1);
  const octave = parseInt(note.slice(-1));
  // Convert flats to sharps if needed
  if (FLAT_TO_SHARP[noteName]) {
    noteName = FLAT_TO_SHARP[noteName];
  }
  const noteIndex = NOTES.indexOf(noteName);
  if (noteIndex === -1) return null; // Invalid note
  const noteNumber = noteIndex + (octave + 1) * 12;
  return A4 * Math.pow(2, (noteNumber - 69) / 12);
};

const findClosestString = (frequency, currentTuning) => {
  if (!frequency) return null;
  
  const detectedNote = frequencyToNote(frequency);
  const noteName = detectedNote.slice(0, -1);
  const octave = parseInt(detectedNote.slice(-1));
  
  // Find the closest string in current tuning
  let closestString = currentTuning[0];
  let minDifference = Infinity;
  
  currentTuning.forEach(string => {
    const stringFreq = noteToFrequency(string);
    const difference = Math.abs(frequency - stringFreq);
    if (difference < minDifference) {
      minDifference = difference;
      closestString = string;
    }
  });
  
  return closestString;
};

const smoothingFactor = 0.2;

const Gauge = ({ cents = 0 }) => {
  // Clamp cents to [-30, 30] for the gauge
  const clamped = Math.max(-30, Math.min(30, cents));
  // Map -30..0..+30 to -60deg..0..+60deg (adjust as needed)
  const angle = (clamped / 30) * 60;

  return (
    <div className="flex justify-center mb-8">
      <svg width="220" height="110" viewBox="0 0 220 110">
        {/* Arc background */}
        <path
          d="M20,110 A90,90 0 0,1 200,110"
          fill="#222"
          stroke="#444"
          strokeWidth="8"
        />
        {/* Ticks and labels */}
        {[...Array(7)].map((_, i) => {
          const val = -30 + i * 10;
          const theta = ((val + 30) / 60) * Math.PI; // 0 to PI
          const x1 = 110 + 80 * Math.cos(Math.PI - theta);
          const y1 = 110 - 80 * Math.sin(Math.PI - theta);
          const x2 = 110 + 90 * Math.cos(Math.PI - theta);
          const y2 = 110 - 90 * Math.sin(Math.PI - theta);
          return (
            <g key={val}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#888" strokeWidth="2" />
              <text
                x={110 + 70 * Math.cos(Math.PI - theta)}
                y={110 - 70 * Math.sin(Math.PI - theta) + 5}
                textAnchor="middle"
                fontSize="16"
                fill="#ccc"
              >
                {val === 0 ? "0" : val > 0 ? `+${val}` : val}
              </text>
            </g>
          );
        })}
        {/* Needle */}
        <g>
          <line
            x1="110"
            y1="110"
            x2={110 + 70 * Math.sin((-angle * Math.PI) / 180)}
            y2={110 - 70 * Math.cos((-angle * Math.PI) / 180)}
            stroke="#e74c3c"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <circle cx="110" cy="110" r="7" fill="#444" stroke="#fff" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
};

const GuitarTuner = () => {
  const [note, setNote] = useState(null);
  const [frequency, setFrequency] = useState(null);
  const [smoothedFrequency, setSmoothedFrequency] = useState(null);
  const [targetString, setTargetString] = useState(null);
  const [tuningProgress, setTuningProgress] = useState(0);
  const [isInTune, setIsInTune] = useState(false);
  const [tuningStatus, setTuningStatus] = useState({ direction: 'none', cents: 0 });
  const [selectedTuning, setSelectedTuning] = useState('Standard');
  const [manualString, setManualString] = useState(""); // <-- Manual string selector
  const audioRef = useRef(null);

  // Effect to handle tuning status updates
  useEffect(() => {
    if (!smoothedFrequency || !targetString) {
      setTuningStatus({ direction: 'none', cents: 0 });
      return;
    }
    const targetFreq = noteToFrequency(targetString);
    const cents = 1200 * Math.log2(smoothedFrequency / targetFreq);
    const isPerfect = Math.abs(cents) < 5;
    setIsInTune(isPerfect);
    setTuningStatus({
      direction: isPerfect ? 'perfect' : (cents > 0 ? 'high' : 'low'),
      cents
    });
  }, [smoothedFrequency, targetString]);

  // Effect to handle tuning progress updates
  useEffect(() => {
    if (isInTune && targetString) {
      const currentIndex = TUNING_PRESETS[selectedTuning].indexOf(targetString);
      if (currentIndex < TUNING_PRESETS[selectedTuning].length - 1) {
        setTuningProgress(currentIndex + 1);
      }
    }
  }, [isInTune, targetString, selectedTuning]);

  // Effect to reset progress when tuning changes
  useEffect(() => {
    setTuningProgress(0);
    setTargetString(null);
    setNote(null);
    setFrequency(null);
    setSmoothedFrequency(null);
  }, [selectedTuning]);

  useEffect(() => {
    let audioCtx, stream, source, workletNode;
    let detector;

    const initAudio = async () => {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      await audioCtx.audioWorklet.addModule('/pitch-processor.js'); // Make sure this path is correct

      source = audioCtx.createMediaStreamSource(stream);
      workletNode = new window.AudioWorkletNode(audioCtx, 'pitch-processor');

      detector = PitchDetector.forFloat32Array(2048);

      workletNode.port.onmessage = (event) => {
        const input = event.data;
        const [pitch, clarity] = detector.findPitch(input, audioCtx.sampleRate);

        if (clarity > 0.95 && pitch > 50) {
          const detectedNote = frequencyToNote(pitch);
          setNote(detectedNote);
          setFrequency(pitch);
          setSmoothedFrequency(prev =>
            prev ? prev * (1 - smoothingFactor) + pitch * smoothingFactor : pitch
          );
          const closestString = findClosestString(pitch, TUNING_PRESETS[selectedTuning]);
          if (closestString) {
            setTargetString(closestString);
          }
        }
      };

      source.connect(workletNode);
      // No need to connect workletNode to destination (no audio output)
      audioRef.current = { audioCtx, stream, workletNode };
    };

    initAudio();

    return () => {
      if (audioRef.current) {
        const { audioCtx, stream, workletNode } = audioRef.current;
        stream.getTracks().forEach(track => track.stop());
        workletNode.disconnect();
        audioCtx.close();
      }
    };
  }, [selectedTuning]);

  // Update targetString based on manual selection or auto-detect
  useEffect(() => {
    if (manualString) {
      setTargetString(manualString);
    } else if (smoothedFrequency) {
      const closestString = findClosestString(smoothedFrequency, TUNING_PRESETS[selectedTuning]);
      if (closestString) setTargetString(closestString);
    }
  }, [manualString, smoothedFrequency, selectedTuning]);

  const targetFreq = targetString ? noteToFrequency(targetString) : null;

  return (
    <div className="min-h-screen bg-black text-white p-6">
       <h1 className="text-2xl font-bold text-white mb-8 text-center mt-5">Guitar Tuner</h1>
      <div className="max-w-2xl mx-auto bg-gray-700 rounded-2xl shadow-2xl p-6 border border-gray-700">
   <Gauge cents={tuningStatus.cents} />
        <div className="flex justify-center items-center mb-4">
          <span className="text-white text-sm mr-2">
            Target: {targetString} {targetFreq ? `(${targetFreq.toFixed(1)} Hz)` : ''}
          </span>
          <span className="text-white text-sm ml-2">
            Detected: {smoothedFrequency ? `${smoothedFrequency.toFixed(1)} Hz` : '---'}
          </span>
        </div>

        {/* Tuning Status Indicator */}
        <div className="flex justify-center mb-6">
          {isInTune ? (
            <span className="px-6 py-2 rounded-full bg-green-600 text-white font-bold text-lg shadow transition">
              Perfect!
            </span>
          ) : (
            <span className="px-6 py-2 rounded-full bg-gray-800 text-cyan-300 font-semibold text-lg shadow transition">
              {tuningStatus.direction === 'high'
                ? 'Too Sharp'
                : tuningStatus.direction === 'low'
                ? 'Too Flat'
                : 'Play a string to tune'}
            </span>
          )}
        </div>

        {/* String Indicator Buttons */}
        <div className="mb-8 grid grid-cols-3 md:flex md:justify-center gap-2">
          {TUNING_PRESETS[selectedTuning].map((string, idx) => (
            <button
              key={string}
              className={`px-4 py-2 rounded-full border font-bold transition
                ${targetString === string
                  ? "bg-cyan-400 border-cyan-700 text-black shadow-lg scale-110"
                  : "bg-gray-800 border-gray-600 text-gray-300 opacity-70"
                }`}
              disabled
            >
              {string}
            </button>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default GuitarTuner;
