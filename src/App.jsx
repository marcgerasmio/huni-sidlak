import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import GuitarTuner from './components/GuitarTuner';
import ChordDetect from './components/ChordDetector';
import HomePage from './components/HomePage';
import TermsAndConditions from './components/TermsAndConditions';
import AboutPage from './components/AboutPage';
import ChordsList from './components/ChordsList';
function App() {
  return (
    <Router>
      <Routes>
         <Route path="/" element={<HomePage />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/home" element={<LandingPage />} />
        <Route path="/tuner" element={<GuitarTuner />} />
        <Route path="/trial" element={<ChordDetect />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/chords" element={<ChordsList />} />
      </Routes>
    </Router>
  );
}

export default App;
