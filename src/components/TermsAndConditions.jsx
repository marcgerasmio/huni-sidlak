import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const TermsAndConditions = () => {
  const navigate = useNavigate();

  // Checker: redirect if already agreed to terms
  useEffect(() => {
    const agreed = localStorage.getItem("agreedToTerms");
    if (agreed === "true") {
      navigate("/home");
    }
  }, [navigate]);

  const handleAccept = () => {
    localStorage.setItem("agreedToTerms", "true");
    navigate("/home");
  };

  return (
    <div className="min-h-screen flex flex-col justify-between items-center bg-gradient-to-b from-[#0a2327] to-[#0e1c1e] text-white px-4">
      <div className="flex-1 flex flex-col justify-center items-center w-full max-w-lg mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-cyan-400">Terms and Conditions</h1>
        <div className="bg-white/10 rounded-lg p-6 mb-8 w-full text-sm text-gray-200 max-h-[60vh] overflow-y-auto">
          <p>
            Welcome to our app! Before you proceed, please read and accept the following terms and conditions:
          </p>
          <ul className="list-disc pl-6 my-4 space-y-2">
            <li>This app is provided for educational and entertainment purposes only.</li>
            <li>We do not collect or store any personal data without your consent.</li>
            <li>Use of the camera and microphone is required for tuner and chord detection features.</li>
            <li>Do not use this app while driving or in situations requiring your full attention.</li>
            <li>By using this app, you agree to our privacy policy and terms of service.</li>
          </ul>
          <p>
            If you do not agree to these terms, please close the app. For more information, contact us at support@hunisidlak.com.
          </p>
        </div>
        <button
          onClick={handleAccept}
          className="mt-4 px-8 py-3 rounded-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-lg shadow transition"
        >
          I Accept
        </button>
      </div>
      <div className="mb-8 text-center text-xs text-gray-400">
        &copy; 2025 Huni - Sidlak. All rights reserved.
      </div>
    </div>
  );
};

export default TermsAndConditions;