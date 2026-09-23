import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Chatbot from '../components/Chatbot';
import ScrollToTop from '../components/ScrollToTop';
import StickyHireBar from '../components/StickyHireBar';
import { useScrollToTop } from '../hooks/useScrollToTop';

export default function Layout() {
  useScrollToTop();

  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
      <StickyHireBar />
      <ScrollToTop />
      <Chatbot />
    </>
  );
}
