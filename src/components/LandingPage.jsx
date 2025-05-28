"use client"

import { Link } from "react-router-dom"
import BottomNav from "./BottomNav"

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900 overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/6 w-80 h-80 bg-indigo-100 rounded-full filter blur-3xl opacity-50"></div>
        <div className="absolute bottom-1/4 right-1/6 w-96 h-96 bg-purple-100 rounded-full filter blur-3xl opacity-50"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-100 rounded-full filter blur-3xl opacity-50"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="text-center pt-8 pb-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Huni - Sidlak
          </h1>
        </div>

        {/* Tools Grid */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Guitar Tuner Card */}
            <Link to="/tuner" className="group">
              <div className="relative">
                {/* Card glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-200 via-blue-200 to-indigo-200 rounded-3xl blur-lg opacity-0 group-hover:opacity-60 transition-all duration-500"></div>

                <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden shadow-xl border border-gray-200 transform transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl">
                  {/* Card header with icon */}
                  <div className="relative p-8 pb-6">
                    <div className="flex items-center mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                        <svg
                          className="w-8 h-8 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                          />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                          Guitar Tuner
                        </h2>
                        <div className="w-12 h-1 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full mt-2"></div>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-6 leading-relaxed text-justify">
                      Tune your guitar with precision using our real-time pitch detection tuner. Get visual feedback and
                      perfect your tuning accuracy with professional-grade tools.
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-indigo-600 group-hover:text-indigo-700 transition-colors">
                        <span className="mr-2 font-semibold">Try it now</span>
                        <svg
                          className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            {/* Chord Detector Card */}
            <Link to="/trial" className="group">
              <div className="relative">
                {/* Card glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200 rounded-3xl blur-lg opacity-0 group-hover:opacity-60 transition-all duration-500"></div>

                <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden shadow-xl border border-gray-200 transform transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl">
                  {/* Card header with icon */}
                  <div className="relative p-8 pb-6">
                    <div className="flex items-center mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                        <svg
                          className="w-8 h-8 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                          Chord Detector
                        </h2>
                        <div className="w-12 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mt-2"></div>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-6 leading-relaxed  text-justify">
                      Learn guitar chords with our pre-trained model powered camera guide. Get real-time finger position feedback and
                      master new chords with intelligent recognition technology.
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-purple-600 group-hover:text-purple-700 transition-colors">
                        <span className="mr-2 font-semibold">Start learning</span>
                        <svg
                          className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}

export default LandingPage
