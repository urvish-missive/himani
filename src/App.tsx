import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './layout/Layout';
import Home from './pages/Home';
import VirtualCMOPage from './pages/VirtualCMOPage';
import FounderCoachingPage from './pages/FounderCoachingPage';
import TeamTrainingPage from './pages/TeamTrainingPage';
import SpeakingPage from './pages/SpeakingPage';

// Loaded on demand so the admin code and Firebase Auth never ship to regular visitors.
const AdminPage = lazy(() => import('./pages/admin/AdminPage'));
// The blog pulls in the Markdown renderer, so it loads on demand too.
const BlogPage = lazy(() => import('./pages/BlogPage'));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'));

const pageFallback = <div className="min-h-[60vh]" />;

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/admin/*"
          element={
            <Suspense fallback={<div className="min-h-screen bg-paper-2" />}>
              <AdminPage />
            </Suspense>
          }
        />
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/virtual-cmo" element={<VirtualCMOPage />} />
          <Route path="/founder-coaching" element={<FounderCoachingPage />} />
          <Route path="/team-training" element={<TeamTrainingPage />} />
          <Route path="/speaking" element={<SpeakingPage />} />
          <Route
            path="/blog"
            element={
              <Suspense fallback={pageFallback}>
                <BlogPage />
              </Suspense>
            }
          />
          <Route
            path="/blog/:slug"
            element={
              <Suspense fallback={pageFallback}>
                <BlogPostPage />
              </Suspense>
            }
          />

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
