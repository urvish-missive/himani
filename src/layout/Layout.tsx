import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Chatbot from '../components/Chatbot';
import { useScrollToTop } from '../hooks/useScrollToTop';

export default function Layout() {
  useScrollToTop();

  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
      <Chatbot />
    </>
  );
}
