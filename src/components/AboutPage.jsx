import React from "react";
import BottomNav from "./BottomNav";

const AboutPage = () => (
  <div className="min-h-screen bg-gradient-to-b from-[#0a2327] to-[#0e1c1e] flex flex-col pb-24">
    <div className="flex-1 flex flex-col items-center px-6 pt-10">
      <h1 className="text-2xl font-bold text-white mb-8 text-center">Settings &amp; About</h1>
      
      <div className="w-full max-w-xl">
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-2">About</h2>
          <div className="bg-white/10 rounded-lg p-4 text-gray-200 shadow">
            <p className="mb-4">
              <span className="font-semibold text-cyan-400">Huni - Sidlak</span> is a mobile-friendly app that helps you tune your guitar and detect chords in real time using your device's microphone and camera. Get instant feedback, visual guides, and improve your playing experience!
            </p>
            <div className="mb-2">
              <span className="font-semibold text-cyan-300">Developers:</span>
              <ul className="ml-4 list-disc">
                <li>Juan Dela Cruz – juan@email.com</li>
                <li>Maria Santos – maria@email.com</li>
              </ul>
            </div>
            <div className="mb-2">
              <span className="font-semibold text-cyan-300">Adviser:</span>
              <ul className="ml-4 list-disc">
                <li>Prof. Jose Rizal – jose.rizal@university.edu</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-white mb-2">Feedback and Support</h2>
          <div className="bg-white/10 rounded-lg p-4 text-gray-200 shadow">
            For feedback or support, please contact us at <span className="text-cyan-300">support@hunisidlak.com</span>
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white mb-2">Privacy Policy</h2>
          <div className="bg-white/10 rounded-lg p-4 text-gray-200 shadow">
            We respect your privacy. No personal data is collected without your consent. See our full privacy policy for details.
          </div>
        </div>
      </div>
    </div>
    <BottomNav />
  </div>
);

export default AboutPage;