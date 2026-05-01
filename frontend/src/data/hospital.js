// =========================================================
//   N CARE HOSPITAL — Single source of truth
//   Edit values here to update across all pages.
// =========================================================

export const HOSPITAL = {
  name: "N Care Hospital",
  tagline: "Compassionate Care, Trusted Expertise",
  about:
    "A 50-bedded NABH-accredited multi-specialty hospital in Beeramguda, R.C. Puram. " +
    "We bring together eminent doctors, modern infrastructure, and 24x7 emergency services to deliver " +
    "affordable and reliable healthcare to our community.",
  established: "2014",          // PLACEHOLDER — confirm with hospital
  beds: 50,
  doctorsCount: 25,             // PLACEHOLDER
  patientsServed: "50,000+",
  emergencyYearsRunning: "10+",

  contact: {
    address: "25-26, Mayuri Nagar, R.C. Puram, Patancheru Mandal Office, Beeramguda, Hyderabad, Telangana — 502032",
    addressShort: "Beeramguda, R.C. Puram, Hyderabad",
    phone: "+91 40 6162 6364",
    phoneRaw: "+914061626364",
    emergency: "+91 40 6162 6364",
    emergencyRaw: "+914061626364",
    ambulance: "108",                       // PLACEHOLDER
    whatsapp: "+91 99999 99999",            // PLACEHOLDER
    whatsappRaw: "919999999999",
    email: "info@ncarehospital.com",        // PLACEHOLDER
    appointmentEmail: "appointments@ncarehospital.com",   // PLACEHOLDER
    careersEmail: "careers@ncarehospital.com",            // PLACEHOLDER
    mapEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3804.7!2d78.2691!3d17.5103!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sBeeramguda%2C%20Hyderabad!5e0!3m2!1sen!2sin!4v1700000000000",
    mapsLink: "https://maps.google.com/?q=N+Care+Hospital+Beeramguda+Hyderabad",
  },

  hours: {
    opd: "Mon – Sat: 11:00 AM – 4:30 PM",
    opdSunday: "Sunday: By appointment",
    emergency: "24 hours, 7 days a week",
    pharmacy: "8:00 AM – 10:00 PM, daily",
    lab: "8:00 AM – 8:00 PM, daily",
  },

  social: {
    facebook: "#",
    instagram: "#",
    youtube: "#",
    twitter: "#",
    linkedin: "#",
  },

  departments: [
    { slug: "orthopedics",      name: "Orthopedics",               icon: "🦴", desc: "Bone, joint and spine care, fracture management, sports injury rehab." },
    { slug: "gynecology",       name: "Obstetrics & Gynecology",   icon: "🤰", desc: "Antenatal care, fertility, high-risk pregnancy, women's wellness." },
    { slug: "dermatology",      name: "Dermatology & Cosmetology", icon: "✨", desc: "Skin allergies, acne, scar treatment, trichology, cosmetic dermatology." },
    { slug: "cardiology",       name: "Cardiology",                icon: "❤️", desc: "Heart disease management, ECG, chronic cardiac care." },
    { slug: "general-medicine", name: "General Medicine",          icon: "🩺", desc: "Diabetes, hypertension, fever, infections, lifestyle disease management." },
    { slug: "general-surgery",  name: "General Surgery",           icon: "⚕️", desc: "Minimally invasive (keyhole) procedures, hernia repair, day-care surgery." },
    { slug: "pediatrics",       name: "Pediatrics",                icon: "👶", desc: "Newborn care, vaccinations, child wellness, pediatric illnesses." },
    { slug: "urology",          name: "Urology",                   icon: "💧", desc: "Kidney stones, prostate care, urinary tract conditions." },
    { slug: "ent",              name: "ENT",                       icon: "👂", desc: "Ear, nose and throat disorders, sinus, hearing, voice care." },
    { slug: "neurosurgery",     name: "Neurosurgery",              icon: "🧠", desc: "Brain and spine surgical care, neurological emergencies." },
    { slug: "physiotherapy",    name: "Physiotherapy",             icon: "💪", desc: "Orthopedic, neurological, sports and home-care physio rehab." },
    { slug: "diabetology",      name: "Diabetology",               icon: "🩸", desc: "Diabetes screening, management plans, lifestyle counseling." },
  ],

  doctors: [
    { slug: "dr-n-vamsi-reddy",          name: "Dr. N. Vamsi Reddy",          specialty: "Orthopaedic Surgeon",          department: "orthopedics",      qualifications: "MBBS, MS (Orthopaedics)",                                experience: 15, fee: 400, timings: "Mon – Sat: 11:00 AM – 4:30 PM",   image: "/images/doctors/dr-n-vamsi-reddy.png",          bio: "Senior orthopedic surgeon specializing in joint care, fracture management, and sports injuries. Leads the orthopedics department at N Care Hospital.", languages: ["English","Telugu","Hindi"] },
    { slug: "dr-bandhavi-reddy",         name: "Dr. Bandhavi Reddy",          specialty: "Dermatologist",                department: "dermatology",      qualifications: "MBBS, MD (Dermatology, Venereology & Leprosy)",          experience: 14, fee: 400, timings: "Mon – Sat: 11:00 AM – 4:30 PM",   image: "/images/doctors/dr-bandhavi-reddy.png",         bio: "Dermatologist with 14+ years treating skin allergies, acne/pimples, scar/keloid, trichology and cosmetology cases.",                              languages: ["English","Telugu","Hindi"] },
    { slug: "dr-pavitra-reddy",          name: "Dr. Pavitra Reddy",           specialty: "Obstetrician & Gynecologist",  department: "gynecology",       qualifications: "MBBS, MS (Obstetrics & Gynaecology)",                    experience: 15, fee: 300, timings: "Mon – Sat: 11:00 AM – 4:30 PM",   image: "/images/doctors/dr-pavitra-reddy.png",          bio: "Experienced gynecologist providing antenatal care, fertility treatment, and women's wellness consultations.",                                     languages: ["English","Telugu","Hindi"] },
    { slug: "dr-r-rao",                  name: "Dr. R. V. Venkata Rao",       specialty: "Senior Cardiologist",          department: "cardiology",       qualifications: "MBBS, DNB (General Medicine), DM (Cardiology)",          experience: 19, fee: 650, timings: "Mon, Wed, Fri: 5:00 PM – 7:00 PM", image: "/images/doctors/dr-r-rao.png",                  bio: "Senior cardiologist with nearly two decades of experience in non-invasive cardiology and chronic disease management.",                            languages: ["English","Telugu","Hindi"] },
    // PLACEHOLDER specialty — please confirm with hospital and update.
    { slug: "dr-c-venkateshwara-reddy",  name: "Dr. C. Venkateshwara Reddy",  specialty: "Senior Consultant Physician",  department: "general-medicine", qualifications: "MBBS, MD (General Medicine)",                            experience: 18, fee: 500, timings: "Mon – Sat: 11:00 AM – 4:30 PM",   image: "/images/doctors/dr-c-venkateshwara-reddy.png",  bio: "Senior consultant physician with extensive experience in internal medicine, lifestyle disease management, and preventive care.",                  languages: ["English","Telugu","Hindi"] },
    { slug: "dr-r-sri-vardhan",          name: "Dr. R. Sri Vardhan",          specialty: "General Surgeon",              department: "general-surgery",  qualifications: "MBBS, MS (General Surgery)",                             experience: 3,  fee: 350, timings: "Mon – Sat: 12:00 PM – 4:00 PM",   image: null,                                            bio: "General surgeon focused on minimally invasive (keyhole) surgery and hernia repair.",                                                              languages: ["English","Telugu","Hindi"] },
    { slug: "dr-sp-nirmala",             name: "Dr. S. P. Nirmala",           specialty: "Senior Gynecologist",          department: "gynecology",       qualifications: "MBBS, MS (Obstetrics & Gynaecology)",                    experience: 17, fee: 500, timings: "Mon – Sat: 11:00 AM – 2:00 PM",   image: null,                                            bio: "Senior gynecologist specializing in fertility treatment, high-risk pregnancy and antenatal care.",                                                 languages: ["English","Telugu","Hindi"] },
  ],

  packages: [
    { name: "Basic Health Checkup",        price:  999, mrp: 1999, featured: false, tests: ["CBC (Complete Blood Count)","Blood Sugar (Fasting)","Lipid Profile","ECG","Urine Routine","BP & BMI Assessment","Doctor consultation"] },
    { name: "Comprehensive Health Checkup",price: 2499, mrp: 4999, featured: true,  tests: ["35+ blood tests","Liver & Kidney function","Thyroid panel (T3, T4, TSH)","ECG + 2D Echo","Chest X-Ray","Abdominal Ultrasound","Physician + Specialist consultation"] },
    { name: "Diabetes Care Package",       price: 1499, mrp: 2999, featured: false, tests: ["HbA1c","Fasting & PP Sugar","Lipid Profile","Kidney Function (Creatinine)","Urine Microalbumin","Eye check-up","Diabetologist consultation"] },
    { name: "Women's Wellness Package",    price: 2999, mrp: 5499, featured: false, tests: ["CBC, Blood Sugar, Lipid","Thyroid panel","Pap Smear","Breast & Pelvic exam","USG Pelvis","Bone Density (Vit D, Calcium)","Gynecologist consultation"] },
    { name: "Cardiac Risk Assessment",     price: 3499, mrp: 6499, featured: false, tests: ["ECG + 2D Echo","TMT (Stress test)","Lipid + hs-CRP","Blood Sugar + HbA1c","Kidney function","BP, BMI","Cardiologist consultation"] },
    { name: "Senior Citizen Package (60+)",price: 3999, mrp: 7999, featured: false, tests: ["50+ tests","ECG + 2D Echo","Chest X-Ray, USG Abdomen","Bone density","Eye + Hearing","Vitamin D, B12","Two specialist consultations"] },
  ],

  insurance: [
    "Star Health Insurance","HDFC ERGO Health","Bajaj Allianz","ICICI Lombard","New India Assurance",
    "Care Health Insurance","Niva Bupa","Reliance General","United India Insurance",
    "Aarogyasri (Telangana)","CGHS / ECHS","Tata AIG",
  ],

  features: [
    { icon: "🏥", title: "NABH Accredited",        desc: "Recognized for adherence to national healthcare quality and patient-safety standards." },
    { icon: "🚑", title: "24×7 Emergency",          desc: "Round-the-clock emergency, trauma care and ICU support, every day of the year." },
    { icon: "👨‍⚕️", title: "Eminent Specialists",   desc: "A panel of experienced consultants across 12 specialties for comprehensive care." },
    { icon: "🔬", title: "Modern Diagnostics",      desc: "Sophisticated lab, digital X-ray and imaging support diagnoses with confidence." },
    { icon: "🛏️", title: "50-Bed Multi-Specialty", desc: "Inpatient wards, ICU, SICU, and 2 modular operation theatres with laminar flow." },
    { icon: "💰", title: "Affordable Care",         desc: "Transparent pricing and cashless treatment under leading insurance partners." },
  ],

  testimonials: [
    { name: "Priya S.",  loc: "Beeramguda", rating: 5, text: "Doctors are very friendly and explained the treatment clearly. Hospitality from staff was excellent." },
    { name: "Ravi K.",   loc: "R.C. Puram", rating: 5, text: "Affordable, professional, and the staff guides you through every step. Felt cared for, not rushed." },
    { name: "Sushma R.", loc: "Patancheru", rating: 4, text: "Came in for a dermatology consultation. Dr. Bandhavi was patient and answered all my questions." },
    { name: "Mahesh G.", loc: "Lingampally",rating: 5, text: "Got my mother's knee replaced here. Dr. Vamsi and the ortho team were outstanding throughout." },
    { name: "Neha A.",   loc: "Tellapur",   rating: 5, text: "Used the 24/7 emergency for a road traffic injury — fast triage and excellent trauma care. Thank you!" },
    { name: "Vinod M.",  loc: "Miyapur",    rating: 4, text: "Booked a comprehensive health checkup. Reports were detailed and the physician explained everything." },
  ],

  blogPosts: [
    { slug: "manage-monsoon-fever",   title: "5 ways to manage monsoon fever at home",       category: "General Medicine", date: "2026-04-12", excerpt: "When to rest, when to hydrate, and when to see a doctor — a quick guide for the rainy season." },
    { slug: "knee-pain-causes",       title: "Knee pain after 40: when to see an orthopedist", category: "Orthopedics",      date: "2026-03-28", excerpt: "Most knee pain is mechanical and treatable. Here's how to spot warning signs early." },
    { slug: "first-prenatal-visit",   title: "Your first prenatal visit: what to expect",      category: "Gynecology",       date: "2026-03-15", excerpt: "From scans to supplements — a calm walkthrough of your first appointment." },
    { slug: "skin-monsoon-care",      title: "Healthy skin in humid weather",                  category: "Dermatology",      date: "2026-02-22", excerpt: "Simple changes to your routine that prevent fungal infections and breakouts." },
  ],
};
