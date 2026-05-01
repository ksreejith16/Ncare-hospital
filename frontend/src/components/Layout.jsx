import Header from './Header.jsx';
import Footer from './Footer.jsx';
import FloatingActions from './FloatingActions.jsx';
import Chatbot from './Chatbot.jsx';
import Toast from './Toast.jsx';

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <FloatingActions />
      <Chatbot />
      <Toast />
    </>
  );
}
