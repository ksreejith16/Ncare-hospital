import PageHeader from '../components/PageHeader.jsx';

export default function Privacy() {
  return (
    <>
      <PageHeader title="Privacy Policy" breadcrumb={[{ label: 'Privacy Policy' }]} />
      <section className="section">
        <div className="container" style={{ maxWidth: 800 }}>
          <div style={{ background: '#fff', padding: 40, borderRadius: 16, boxShadow: 'var(--shadow-sm)' }}>
            <p style={{ marginBottom: 16, color: 'var(--text-light)', fontSize: '.9rem' }}>Last updated: April 2026</p>

            <h3>1. Information we collect</h3>
            <p style={{ margin: '12px 0' }}>We collect personal and medical information that you voluntarily provide when you book an appointment, contact us, or use our services. This may include your name, age, gender, mobile number, email address, medical history, and any details you share during consultations.</p>

            <h3>2. How we use your information</h3>
            <p style={{ margin: '12px 0' }}>Your information is used to schedule appointments, deliver clinical care, process insurance claims, send reminders/follow-ups, and improve our services. We do not sell your information to third parties.</p>

            <h3>3. SMS / OTP communications</h3>
            <p style={{ margin: '12px 0' }}>By providing your mobile number, you consent to receiving SMS messages for appointment confirmations, OTPs, reminders, and limited service updates. You may opt out of non-essential messages at any time.</p>

            <h3>4. Sharing of information</h3>
            <p style={{ margin: '12px 0' }}>Medical information is shared only with treating clinicians, the hospital's authorized staff, your insurer/TPA (with your consent), and as required by law. Reports and prescriptions are accessible only to the patient or an authorized representative.</p>

            <h3>5. Data security</h3>
            <p style={{ margin: '12px 0' }}>We implement administrative, technical and physical safeguards to protect your information. Access to medical records is logged and audited. Our team is trained on confidentiality and patient privacy.</p>

            <h3>6. Cookies</h3>
            <p style={{ margin: '12px 0' }}>This website uses essential cookies to remember your session preferences and analytics cookies to understand site usage. You can control cookies via your browser settings.</p>

            <h3>7. Your rights</h3>
            <p style={{ margin: '12px 0' }}>You can request access to, correction of, or deletion of your personal information. Email us using the contact details on this site to make such a request. Some medical records must be retained as required by Indian law.</p>

            <h3>8. Changes</h3>
            <p style={{ margin: '12px 0' }}>We may update this policy. Material changes will be communicated via the website. Continued use of the site signifies acceptance of the updated policy.</p>

            <h3>9. Contact</h3>
            <p style={{ margin: '12px 0' }}>For privacy questions or grievances, please reach our patient experience team via the Contact page.</p>
          </div>
        </div>
      </section>
    </>
  );
}
