import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './layout/Layout';
import Home from './pages/Home';
import AboutPage from './pages/AboutPage';
import PodcastPage from './pages/PodcastPage';
import ServicePage from './pages/ServicePage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/podcast" element={<PodcastPage />} />
          <Route path="/consulting" element={<ServicePage serviceId="consulting" />} />
          <Route path="/coaching" element={<ServicePage serviceId="coaching" />} />
          <Route path="/training" element={<ServicePage serviceId="training" />} />
          <Route path="/speaking" element={<ServicePage serviceId="speaking" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
