import React, { useState, useRef, useEffect } from 'react';

// Chord finger positions data
// Format: [string, fret, finger, note]
// string: 1-6 (1 is highest/thinnest string)
// fret: 0-12 (0 is open string)
// finger: 1-4 (1=index, 2=middle, 3=ring, 4=pinky)
const CHORD_POSITIONS = {
  'G': [
    { string: 6, fret: 3, finger: 2, note: 'G' },
    { string: 5, fret: 2, finger: 1, note: 'B' },
    { string: 4, fret: 0, finger: 0, note: 'D' },
    { string: 3, fret: 0, finger: 0, note: 'G' },
    { string: 2, fret: 0, finger: 0, note: 'B' },
    { string: 1, fret: 3, finger: 3, note: 'G' },
  ],
  'C': [
    { string: 6, fret: 0, finger: 0, note: 'E' },
    { string: 5, fret: 3, finger: 3, note: 'C' },
    { string: 4, fret: 2, finger: 2, note: 'E' },
    { string: 3, fret: 0, finger: 0, note: 'G' },
    { string: 2, fret: 1, finger: 1, note: 'C' },
    { string: 1, fret: 0, finger: 0, note: 'E' },
  ],
  'D': [
    { string: 6, fret: 0, finger: 0, note: 'E' },
    { string: 5, fret: 0, finger: 0, note: 'A' },
    { string: 4, fret: 0, finger: 0, note: 'D' },
    { string: 3, fret: 2, finger: 2, note: 'A' },
    { string: 2, fret: 3, finger: 3, note: 'D' },
    { string: 1, fret: 2, finger: 1, note: 'F#' },
  ],
  'E': [
    { string: 6, fret: 0, finger: 0, note: 'E' },
    { string: 5, fret: 2, finger: 2, note: 'B' },
    { string: 4, fret: 2, finger: 3, note: 'E' },
    { string: 3, fret: 1, finger: 1, note: 'G#' },
    { string: 2, fret: 0, finger: 0, note: 'B' },
    { string: 1, fret: 0, finger: 0, note: 'E' },
  ],
  'A': [
    { string: 6, fret: 0, finger: 0, note: 'E' },
    { string: 5, fret: 0, finger: 0, note: 'A' },
    { string: 4, fret: 2, finger: 1, note: 'E' },
    { string: 3, fret: 2, finger: 2, note: 'A' },
    { string: 2, fret: 2, finger: 3, note: 'C#' },
    { string: 1, fret: 0, finger: 0, note: 'E' },
  ],
};

const ChordGuide = () => {
  const [selectedChord, setSelectedChord] = useState('G');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Start/stop camera
  const toggleCamera = async () => {
    if (isCameraActive) {
      const stream = videoRef.current?.srcObject;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsCameraActive(true);
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
      }
    }
  };

  // Draw finger positions overlay
  useEffect(() => {
    if (!isCameraActive || !canvasRef.current || !videoRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const video = videoRef.current;

    const drawOverlay = () => {
      // Set canvas size to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw reference line for alignment
      ctx.beginPath();
      ctx.moveTo(0, canvas.height * 0.3); // Line at 30% from top
      ctx.lineTo(canvas.width, canvas.height * 0.3);
      ctx.strokeStyle = 'rgba(0, 255, 0, 0.5)'; // Semi-transparent green
      ctx.lineWidth = 2;
      ctx.stroke();

      // LANDSCAPE FRETBOARD OVERLAY
      // Margins
      const marginX = canvas.width * 0.1;
      const marginY = canvas.height * 0.15;
      const fretCount = 5;
      const stringCount = 6;
      const boardWidth = canvas.width - 2 * marginX;
      const boardHeight = canvas.height - 2 * marginY;

      // Draw frets (vertical lines)
      ctx.strokeStyle = 'rgba(255,255,255,0.3)';
      ctx.lineWidth = 2;
      for (let fret = 0; fret <= fretCount; fret++) {
        const x = marginX + (boardWidth / fretCount) * fret;
        ctx.beginPath();
        ctx.moveTo(x, marginY);
        ctx.lineTo(x, marginY + boardHeight);
        ctx.stroke();
      }
      // Draw strings (horizontal lines)
      for (let s = 0; s < stringCount; s++) {
        const y = marginY + (boardHeight / (stringCount - 1)) * s;
        ctx.beginPath();
        ctx.moveTo(marginX, y);
        ctx.lineTo(marginX + boardWidth, y);
        ctx.stroke();
      }

      // Draw note positions (landscape: string=row, fret=col)
      const positions = CHORD_POSITIONS[selectedChord];
      const colorMap = {
        'E': '#1E90FF',
        'A': '#32CD32',
        'D': '#FFD700',
        'G': '#FF69B4',
        'B': '#FF8C00',
        'C': '#FFFFFF',
        'F#': '#8A2BE2',
        'G#': '#00CED1',
        'C#': '#FF1493',
      };
      positions.forEach(pos => {
        if (pos.finger === 0) return; // Skip open strings
        // Fret: 0=nut (left), 1=first fret, ...
        // String: 6=top, 1=bottom
        const col = pos.fret; // 0=nut, 1=1st fret, ...
        const row = stringCount - pos.string; // 6th string=0 (top), 1st string=5 (bottom)
        // Place circle between frets (except for open string, which is left of nut)
        let x;
        if (col === 0) {
          x = marginX - 25; // open string, left of nut
        } else {
          x = marginX + (boardWidth / fretCount) * (col - 0.5);
        }
        const y = marginY + (boardHeight / (stringCount - 1)) * row;
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, 2 * Math.PI);
        ctx.fillStyle = colorMap[pos.note] || 'rgba(255, 0, 0, 0.5)';
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = 'black';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(pos.note, x, y);
      });

      requestAnimationFrame(drawOverlay);
    };

    video.addEventListener('play', drawOverlay);
    return () => video.removeEventListener('play', drawOverlay);
  }, [isCameraActive, selectedChord]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          🎸 Chord Guide
        </h2>

        <div className="mb-8">
          <label className="block text-lg text-gray-300 mb-2">Select Chord:</label>
          <select 
            value={selectedChord}
            onChange={(e) => setSelectedChord(e.target.value)}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            {Object.keys(CHORD_POSITIONS).map(chord => (
              <option key={chord} value={chord}>{chord}</option>
            ))}
          </select>
        </div>

        <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-4">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full"
          />
        </div>

        <button
          onClick={toggleCamera}
          className="w-full p-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-bold transition-colors"
        >
          {isCameraActive ? 'Stop Camera' : 'Start Camera'}
        </button>

        <div className="mt-8 bg-gray-800 rounded-lg p-4">
          <h3 className="text-xl font-bold mb-4">How to use:</h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-300">
            <li>Select a chord from the dropdown</li>
            <li>Click "Start Camera"</li>
            <li>Point your camera at your guitar</li>
            <li>Follow the red circles to place your fingers</li>
            <li>The numbers indicate which finger to use (1=index, 2=middle, 3=ring, 4=pinky)</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default ChordGuide; 