import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './layout/Layout';
import Home from './pages/Home';
import VirtualCMOPage from './pages/VirtualCMOPage';
import FounderCoachingPage from './pages/FounderCoachingPage';
import TeamTrainingPage from './pages/TeamTrainingPage';
import SpeakingPage from './pages/SpeakingPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/virtual-cmo" element={<VirtualCMOPage />} />
          <Route path="/founder-coaching" element={<FounderCoachingPage />} />
          <Route path="/team-training" element={<TeamTrainingPage />} />
          <Route path="/speaking" element={<SpeakingPage />} />

          {/* Legacy route redirects */}
          <Route path="/consulting" element={<Navigate to="/virtual-cmo" replace />} />
          <Route path="/coaching" element={<Navigate to="/founder-coaching" replace />} />
          <Route path="/training" element={<Navigate to="/team-training" replace />} />
          <Route path="/about" element={<Navigate to="/" replace />} />
          <Route path="/podcast" element={<Navigate to="/speaking" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
