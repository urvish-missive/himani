import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Chatbot from '../components/Chatbot';
import ScrollToTop from '../components/ScrollToTop';
import StickyHireBar from '../components/StickyHireBar';
import { useScrollToTop } from '../hooks/useScrollToTop';
import { ChatbotProvider } from '../context/ChatbotContext';

export default function Layout() {
  useScrollToTop();

  return (
    <ChatbotProvider>
      <Navbar />
      <Outlet />
      <Footer />
      <StickyHireBar />
      <ScrollToTop />
      <Chatbot />
    </ChatbotProvider>
  );
}
