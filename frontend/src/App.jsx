import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Layout from './components/Layout.jsx';

import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Departments from './pages/Departments.jsx';
import Doctors from './pages/Doctors.jsx';
import BookAppointment from './pages/BookAppointment.jsx';
import HealthCheckups from './pages/HealthCheckups.jsx';
import Insurance from './pages/Insurance.jsx';
import Contact from './pages/Contact.jsx';
import Emergency from './pages/Emergency.jsx';
import Services from './pages/Services.jsx';
import Gallery from './pages/Gallery.jsx';
import Careers from './pages/Careers.jsx';
import Blog from './pages/Blog.jsx';
import PatientPortal from './pages/PatientPortal.jsx';
import Privacy from './pages/Privacy.jsx';
import Terms from './pages/Terms.jsx';
import NotFound from './pages/NotFound.jsx';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [pathname]);
  return null;
}

export default function App() {
  return (
    <Layout>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/departments" element={<Departments />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/book-appointment" element={<BookAppointment />} />
        <Route path="/health-checkups" element={<HealthCheckups />} />
        <Route path="/insurance" element={<Insurance />} />
        <Route path="/services" element={<Services />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/emergency" element={<Emergency />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/patient-portal" element={<PatientPortal />} />
        <Route path="/privacy-policy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}
