import { useLocation } from 'react-router-dom';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import FloatingActions from './FloatingActions.jsx';
import Chatbot from './Chatbot.jsx';
import Toast from './Toast.jsx';

export default function Layout({ children }) {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');

  return (
    <>
      {!isAdmin && <Header />}
      <main>{children}</main>
      {!isAdmin && <Footer />}
      {!isAdmin && <FloatingActions />}
      {!isAdmin && <Chatbot />}
      <Toast />
    </>
  );
}
