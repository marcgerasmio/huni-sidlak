import React from 'react';
import { Link } from 'react-router-dom';
import BottomNav from './BottomNav';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Tools Grid */}
      <h1 className="text-2xl font-bold text-white text-center mt-5">Huni - Sidlak</h1>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 py-6">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Guitar Tuner Card */}
          <Link to="/tuner" className="group">
            <div className="bg-gray-700 rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <div className="p-8">

             <h2 className="text-2xl font-bold mb-4" style={{ color: '#08846c' }}>
              Guitar Tuner
            </h2>

                <p className="text-white mb-4">
                  Tune your guitar with precision using our real-time pitch detection tuner.
                  Get visual feedback and perfect your tuning accuracy.
                </p>
                <div className="flex items-center text-blue-400 group-hover:text-blue-300">
                  <span className="mr-2 text-white">
                    Try it now
                  </span>
                  <svg className="text-white w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>


             {/* Chord Guide Card */}
             <Link to="/trial" className="group">
            <div className="bg-gray-700 rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <div className="p-8">
                <h2 className="text-2xl font-bold mb-4" style={{ color: '#08846c' }}>
                  Chord Detector
                </h2>
                <p className="text-white mb-6">
                  Learn guitar chords with our interactive camera guide.
                  Get real-time finger position feedback and master new chords.
                </p>
                <div className="flex items-center text-blue-400 group-hover:text-blue-300">
                  <span className="mr-2 text-white">Start learning</span>
                  <svg className="text-white w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default LandingPage;