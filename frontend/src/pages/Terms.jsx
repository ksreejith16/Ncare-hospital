import PageHeader from '../components/PageHeader.jsx';

export default function Terms() {
  return (
    <>
      <PageHeader title="Terms of Service" breadcrumb={[{ label: 'Terms' }]} />
      <section className="section">
        <div className="container" style={{ maxWidth: 800 }}>
          <div style={{ background: '#fff', padding: 40, borderRadius: 16, boxShadow: 'var(--shadow-sm)' }}>
            <p style={{ marginBottom: 16, color: 'var(--text-light)', fontSize: '.9rem' }}>Last updated: April 2026</p>

            <h3>1. About this site</h3>
            <p style={{ margin: '12px 0' }}>This website provides information about N Care Hospital, our services, and online appointment booking. The content on this site is for informational purposes and is not a substitute for professional medical advice.</p>

            <h3>2. Appointment bookings</h3>
            <p style={{ margin: '12px 0' }}>An online booking is a request — final confirmation depends on doctor availability and clinical priority. You will receive an SMS / email confirmation. Please reach the hospital 15 minutes before your slot with a valid ID.</p>

            <h3>3. Cancellations and no-shows</h3>
            <p style={{ margin: '12px 0' }}>You may cancel or reschedule appointments via the Patient Portal or by calling us. Repeated no-shows may result in a cancellation fee being charged at the next visit.</p>

            <h3>4. Online consultations</h3>
            <p style={{ margin: '12px 0' }}>Where offered, online consultations are governed by Telemedicine Practice Guidelines, India. Online consultations are not appropriate for emergencies — call the emergency line if your situation is urgent.</p>

            <h3>5. Payments</h3>
            <p style={{ margin: '12px 0' }}>Consultation fees and package prices listed on this site are subject to change. Final billing is determined at the hospital, factoring in the actual services provided. Insurance / cashless approvals are subject to the insurer's terms.</p>

            <h3>6. Limitation of liability</h3>
            <p style={{ margin: '12px 0' }}>We make reasonable efforts to keep the information accurate, but the website is provided on an "as-is" basis. We are not liable for indirect or consequential damages arising from use of this site.</p>

            <h3>7. Intellectual property</h3>
            <p style={{ margin: '12px 0' }}>All content on this site — text, images, logos — is owned by the hospital or used with permission. Reproduction without consent is not permitted.</p>

            <h3>8. Governing law</h3>
            <p style={{ margin: '12px 0' }}>These terms are governed by the laws of India. Any disputes are subject to the exclusive jurisdiction of the courts of Hyderabad, Telangana.</p>

            <h3>9. Contact</h3>
            <p style={{ margin: '12px 0' }}>For questions about these terms, please use the Contact page.</p>
          </div>
        </div>
      </section>
    </>
  );
}
