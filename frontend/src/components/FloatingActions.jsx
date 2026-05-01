import { MessageCircle } from 'lucide-react';
import { HOSPITAL } from '../data/hospital.js';

export default function FloatingActions() {
  return (
    <div className="floating-actions" style={{ bottom: 96 }}>
      <a
        href={`https://wa.me/${HOSPITAL.contact.whatsappRaw}`}
        className="fab fab-whatsapp"
        aria-label="Chat with us on WhatsApp"
        target="_blank"
        rel="noopener noreferrer"
      >
        <MessageCircle size={24} />
      </a>
    </div>
  );
}
