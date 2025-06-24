import { useState } from "react"
import BottomNav from "./BottomNav"

const CHORDS = [
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
  { name: "G", img: "g.png"},
]

const ChordModal = ({ open, chord, onClose }) => {
  if (!open || !chord) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-xs w-full relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold text-center mb-4">{chord.name} Chord</h2>
        <img
          src={chord.img}
          alt={`${chord.name} chord diagram`}
          className="mx-auto mb-2 max-h-64"
        />
      </div>
    </div>
  )
}

const ChordsList = () => {
  const [selectedChord, setSelectedChord] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)

  const handleChordClick = (chord) => {
    setSelectedChord(chord)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setSelectedChord(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Guitar Chords
          </h1>
          <p className="text-lg text-gray-600">Tap a chord to view its diagram</p>
        </div>

        {/* Chord List */}
        <div className="max-w-2xl mx-auto grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {CHORDS.map((chord) => (
            <button
              key={chord.name}
              className="bg-white rounded-xl shadow border border-gray-200 p-6 text-2xl font-bold hover:bg-indigo-50 transition"
              onClick={() => handleChordClick(chord)}
            >
              {chord.name}
            </button>
          ))}
        </div>
      </div>

      <ChordModal open={modalOpen} chord={selectedChord} onClose={handleCloseModal} />
      <BottomNav />
    </div>
  )
}

export default ChordsList