import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";


const HomePage = () => {
  const navigate = useNavigate();

  // Check localStorage on mount
  useEffect(() => {
    const started = localStorage.getItem("getStarted");
    if (started === "true") {
      navigate("/terms");
    }
  }, [navigate]);

  const handleGetStarted = () => {
    localStorage.setItem("getStarted", "true");
    navigate("/terms");
  };

  return (
    <div className="min-h-screen flex flex-col justify-between items-center bg-gradient-to-b from-[#0a2327] to-[#0e1c1e] text-white">
      {/* Centered content */}
      <div className="flex-1 flex flex-col justify-center items-center">
        {/* Logo */}
        <div className="mb-4">
          <img src="logo1.png" alt="App Logo" className="h-45 w-45 object-contain mx-auto" />
        </div>
        {/* App name */}
        <div className="mb-24">
          <span className="text-xl font-light tracking-widest">Huni - Sidlak</span>
        </div>
        {/* Get Started Button */}
        <button
          onClick={handleGetStarted}
          className="mt-8 px-8 py-3 rounded-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-lg shadow transition"
        >
          Start Playing!
        </button>
      </div>
      {/* Footer */}
      <div className="mb-8 text-center text-sm text-gray-300">
        &copy; 2025 Huni - Sidlak. All rights reserved.
      </div>
    </div>
  );
};

export default HomePage;