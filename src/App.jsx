import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import GuitarTuner from './components/GuitarTuner';
import ChordGuide from './components/ChordGuide';
import ChordDetector from './components/ChordDetector';
import ChordDetect from './components/Trial';
import HomePage from './components/HomePage';
import TermsAndConditions from './components/TermsAndConditions';
import AboutPage from './components/AboutPage';
function App() {
  return (
    <Router>
      <Routes>
         <Route path="/" element={<HomePage />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/home" element={<LandingPage />} />
        <Route path="/tuner" element={<GuitarTuner />} />
        <Route path="/chord-guide" element={<ChordGuide />} />
        <Route path="/chord-detector" element={<ChordDetector />} />
        <Route path="/trial" element={<ChordDetect />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </Router>
  );
}

export default App;
