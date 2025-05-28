"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

const HomePage = () => {
  const navigate = useNavigate()

  // Check localStorage on mount
  useEffect(() => {
    const started = localStorage.getItem("getStarted")
    if (started === "true") {
      navigate("/terms")
    }
  }, [navigate])

  const handleGetStarted = () => {
    localStorage.setItem("getStarted", "true")
    navigate("/terms")
  }

  return (
    <div className="min-h-screen flex flex-col justify-between items-center bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900 overflow-hidden relative">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-100 rounded-full filter blur-3xl opacity-60"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-100 rounded-full filter blur-3xl opacity-60"></div>
        <div className="absolute top-2/3 left-1/3 w-72 h-72 bg-blue-100 rounded-full filter blur-3xl opacity-60"></div>

        {/* Guitar strings decorative element */}
        <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent top-1/3"></div>
        <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent top-1/3 mt-8"></div>
        <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent top-1/3 mt-16"></div>
        <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent top-1/3 mt-24"></div>
        <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent top-1/3 mt-32"></div>
        <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent top-1/3 mt-40"></div>
      </div>

      {/* Centered content */}
      <div className="flex-1 flex flex-col justify-center items-center z-10 px-6">
        {/* Logo with enhanced styling */}
        <div className="mb-8 relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-indigo-100 via-purple-100 to-blue-100 rounded-full blur-xl opacity-80"></div>
          <div className="relative bg-white/80 backdrop-blur-sm rounded-full p-4 border border-gray-200 shadow-xl">
            <img
              src="logo1.png"
              alt="App Logo"
              className="h-40 w-40 object-contain mx-auto filter drop-shadow-lg animate-pulse-slow"
            />
          </div>
        </div>

        {/* App name with gradient text */}
        <div className="mb-20 text-center">
          <h1 className="text-3xl font-light tracking-[0.3em] bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
            HUNI - SIDLAK
          </h1>
          <p className="mt-4 text-gray-600 max-w-md text-center">
            Master guitar chords and tuning with Pre-Trained Model using Yolov8
          </p>
        </div>

        {/* Get Started Button with enhanced styling */}
        <button
          onClick={handleGetStarted}
          className="group relative px-10 py-4 rounded-full overflow-hidden transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50"
        >
          {/* Button background with animated gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 bg-size-200 animate-gradient-x"></div>

          {/* Button glow effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-white blur-md transition-opacity duration-300"></div>

          {/* Button text */}
          <span className="relative flex items-center justify-center text-white font-bold text-lg">
            Start Playing!
            <svg
              className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </span>
        </button>
      </div>

    </div>
  )
}

export default HomePage
