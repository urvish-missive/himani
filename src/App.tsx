import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './layout/Layout';
import Home from './pages/Home';
import AboutPage from './pages/AboutPage';
import PodcastPage from './pages/PodcastPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/podcast" element={<PodcastPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
