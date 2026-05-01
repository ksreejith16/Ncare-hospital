import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, X, Send, RotateCcw, Sparkles } from 'lucide-react';
import { HOSPITAL } from '../data/hospital.js';
import { API_BASE } from '../lib/api.js';

// =========================================================
//   Chatbot — scripted flows + LLM fallback for free-text
// =========================================================

const STR = {
  en: {
    greet:    "Hi! 👋 I'm the N Care assistant. Choose your language to begin:",
    menu:     "How can I help you today?",
    pickDept: "Which department do you need?",
    pickDoc:  "Choose a specialist:",
    deptOver: "We offer 12 specialties. Tap one to learn more:",
    pkgOver:  "Our most popular health checkup packages:",
    insur:    "We're empanelled for cashless treatment with:",
    locate:   `📍 ${HOSPITAL.contact.address}\n🕐 OPD: ${HOSPITAL.hours.opd}\n🚑 Emergency: 24×7`,
    emerg:    `For medical emergencies, call us right away:`,
    ask:      "Sure — type your question below. I'll try my best to help.",
    askThink: "Let me check that…",
    fallback: `I'd love to answer, but my AI assistant isn't connected yet. For now please call us at ${HOSPITAL.contact.phone} or use the menu below.`,
    backMenu: "↩ Back to menu",
    bookCta:  "Yes, book now",
    showDocs: "Show doctors in this dept",
    bookGen:  "Book appointment",
    typing:   "Type your question…",
    online:   "Online · We reply in seconds",
    poweredAi:"AI-powered • Verified medical info",
    botName:  "N Care Assistant",
    options: {
      book: "📅 Book Appointment",
      doc:  "👨‍⚕️ Find a Doctor",
      dept: "🏥 Departments",
      pkg:  "💊 Health Checkups",
      ins:  "🛡️ Insurance",
      loc:  "📍 Location & Hours",
      em:   "🚑 Emergency",
      ask:  "💬 Ask something else",
    },
  },
  te: {
    greet:    "హలో! 👋 నేను N Care సహాయకుడిని. ప్రారంభించడానికి మీ భాషను ఎంచుకోండి:",
    menu:     "ఈ రోజు నేను మీకు ఎలా సహాయం చేయగలను?",
    pickDept: "మీకు ఏ విభాగం అవసరం?",
    pickDoc:  "ఒక నిపుణుడిని ఎంచుకోండి:",
    deptOver: "మేము 12 ప్రత్యేకతలను అందిస్తున్నాము. మరింత తెలుసుకోవడానికి ఎంచుకోండి:",
    pkgOver:  "మా ప్రముఖ హెల్త్ చెకప్ ప్యాకేజీలు:",
    insur:    "క్యాష్‌లెస్ చికిత్స కోసం మేము క్రింది బీమా సంస్థలతో అనుబంధించబడ్డాము:",
    locate:   `📍 ${HOSPITAL.contact.address}\n🕐 OPD: ${HOSPITAL.hours.opd}\n🚑 ఎమర్జెన్సీ: 24×7`,
    emerg:    "వైద్య అత్యవసర పరిస్థితులలో, వెంటనే మాకు కాల్ చేయండి:",
    ask:      "ఖచ్చితంగా — క్రింద మీ ప్రశ్నను టైప్ చేయండి. నేను సహాయం చేయడానికి ప్రయత్నిస్తాను.",
    askThink: "ఒక్క నిమిషం…",
    fallback: `క్షమించండి, నా AI అసిస్టెంట్ ఇంకా కనెక్ట్ చేయబడలేదు. దయచేసి ${HOSPITAL.contact.phone} కి కాల్ చేయండి.`,
    backMenu: "↩ మెనూకి తిరిగి",
    bookCta:  "అవును, ఇప్పుడే బుక్ చేయండి",
    showDocs: "ఈ విభాగంలోని వైద్యులను చూపించు",
    bookGen:  "అపాయింట్‌మెంట్ బుక్ చేయండి",
    typing:   "మీ ప్రశ్నను టైప్ చేయండి…",
    online:   "ఆన్‌లైన్ · సెకన్లలో ప్రత్యుత్తరం",
    poweredAi:"AI ఆధారిత • ధృవీకరించబడిన వైద్య సమాచారం",
    botName:  "N Care సహాయకుడు",
    options: {
      book: "📅 అపాయింట్‌మెంట్ బుక్ చేయండి",
      doc:  "👨‍⚕️ వైద్యుడిని కనుగొనండి",
      dept: "🏥 విభాగాలు",
      pkg:  "💊 హెల్త్ చెకప్‌లు",
      ins:  "🛡️ బీమా",
      loc:  "📍 స్థానం & సమయం",
      em:   "🚑 ఎమర్జెన్సీ",
      ask:  "💬 ఇంకేదైనా అడగండి",
    },
  },
  hi: {
    greet:    "नमस्ते! 👋 मैं N Care सहायक हूं। शुरू करने के लिए अपनी भाषा चुनें:",
    menu:     "आज मैं आपकी कैसे मदद कर सकता हूं?",
    pickDept: "आपको कौन सा विभाग चाहिए?",
    pickDoc:  "एक विशेषज्ञ चुनें:",
    deptOver: "हम 12 विशेषताएं प्रदान करते हैं। अधिक जानने के लिए चुनें:",
    pkgOver:  "हमारे लोकप्रिय हेल्थ चेकअप पैकेज:",
    insur:    "हम इन बीमा कंपनियों के साथ कैशलेस उपचार के लिए सूचीबद्ध हैं:",
    locate:   `📍 ${HOSPITAL.contact.address}\n🕐 OPD: ${HOSPITAL.hours.opd}\n🚑 इमरजेंसी: 24×7`,
    emerg:    "चिकित्सा आपातकाल के लिए, तुरंत हमें कॉल करें:",
    ask:      "ज़रूर — नीचे अपना सवाल टाइप करें। मैं मदद करने की कोशिश करूंगा।",
    askThink: "एक पल…",
    fallback: `माफ़ कीजिए, मेरा AI सहायक अभी कनेक्ट नहीं है। कृपया ${HOSPITAL.contact.phone} पर कॉल करें।`,
    backMenu: "↩ मेनू पर वापस",
    bookCta:  "हां, अभी बुक करें",
    showDocs: "इस विभाग के डॉक्टर दिखाएं",
    bookGen:  "अपॉइंटमेंट बुक करें",
    typing:   "अपना सवाल लिखें…",
    online:   "ऑनलाइन · सेकंड में जवाब",
    poweredAi:"AI-पावर्ड • सत्यापित चिकित्सा जानकारी",
    botName:  "N Care सहायक",
    options: {
      book: "📅 अपॉइंटमेंट बुक करें",
      doc:  "👨‍⚕️ डॉक्टर खोजें",
      dept: "🏥 विभाग",
      pkg:  "💊 हेल्थ चेकअप",
      ins:  "🛡️ बीमा",
      loc:  "📍 स्थान & समय",
      em:   "🚑 इमरजेंसी",
      ask:  "💬 कुछ और पूछें",
    },
  },
};

const LANG_OPTIONS = [
  { label: 'English',   value: 'en' },
  { label: 'తెలుగు',     value: 'te' },
  { label: 'हिन्दी',     value: 'hi' },
];

export default function Chatbot() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState(null);
  const [step, setStep] = useState('lang');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [allowInput, setAllowInput] = useState(false);
  const [busy, setBusy] = useState(false);
  const [unread, setUnread] = useState(0);
  const scrollRef = useRef(null);

  const t = STR[lang] || STR.en;

  // ---------- helpers ----------
  function pushBot(text, opts = null) {
    setMessages(m => [...m, { from: 'bot', text, opts, ts: Date.now() }]);
  }
  function pushUser(text) {
    setMessages(m => [...m, { from: 'user', text, ts: Date.now() }]);
  }

  function reset() {
    setLang(null);
    setStep('lang');
    setMessages([]);
    setInput('');
    setAllowInput(false);
    setTimeout(() => greet(), 200);
  }

  function greet() {
    pushBot(STR.en.greet, LANG_OPTIONS);
  }

  function showMenu(useLang = lang) {
    const tt = STR[useLang] || STR.en;
    setStep('menu');
    setAllowInput(false);
    pushBot(tt.menu, [
      { label: tt.options.book, value: 'menu_book' },
      { label: tt.options.doc,  value: 'menu_doc' },
      { label: tt.options.dept, value: 'menu_dept' },
      { label: tt.options.pkg,  value: 'menu_pkg' },
      { label: tt.options.ins,  value: 'menu_ins' },
      { label: tt.options.loc,  value: 'menu_loc' },
      { label: tt.options.em,   value: 'menu_em' },
      { label: tt.options.ask,  value: 'menu_ask' },
    ]);
  }

  // ---------- lifecycle ----------
  useEffect(() => {
    if (open && messages.length === 0) {
      setTimeout(greet, 250);
    }
    if (open) setUnread(0);
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, busy]);

  // Greeting nudge after 8s
  useEffect(() => {
    const timer = setTimeout(() => { if (!open) setUnread(1); }, 8000);
    return () => clearTimeout(timer);
  }, []);

  // ---------- option handler ----------
  function handleOption(opt) {
    pushUser(opt.label);

    // Language pick
    if (step === 'lang') {
      setLang(opt.value);
      setTimeout(() => showMenu(opt.value), 350);
      return;
    }

    // Main menu
    if (opt.value === 'back_menu') { setTimeout(() => showMenu(), 250); return; }
    if (opt.value === 'menu_book') {
      setStep('book_dept');
      setTimeout(() => pushBot(t.pickDept, deptOptions('book_')), 350);
      return;
    }
    if (opt.value === 'menu_doc') {
      setStep('pick_doc');
      setTimeout(() => pushBot(t.pickDoc, doctorOptions()), 350);
      return;
    }
    if (opt.value === 'menu_dept') {
      setStep('view_dept');
      setTimeout(() => pushBot(t.deptOver, deptOptions('view_')), 350);
      return;
    }
    if (opt.value === 'menu_pkg') {
      setTimeout(() => pushBot(t.pkgOver, packageOptions()), 350);
      return;
    }
    if (opt.value === 'menu_ins') {
      const list = '\n• ' + HOSPITAL.insurance.join('\n• ');
      setTimeout(() => pushBot(t.insur + list, [
        { label: 'View insurance page', value: 'go_insurance' },
        { label: t.backMenu,            value: 'back_menu' },
      ]), 350);
      return;
    }
    if (opt.value === 'menu_loc') {
      setTimeout(() => pushBot(t.locate, [
        { label: 'Open in Google Maps', value: 'open_maps' },
        { label: t.backMenu,             value: 'back_menu' },
      ]), 350);
      return;
    }
    if (opt.value === 'menu_em') {
      setTimeout(() => pushBot(t.emerg + `\n📞 ${HOSPITAL.contact.phone}`, [
        { label: `📞 Call ${HOSPITAL.contact.phone}`, value: 'tel' },
        { label: t.backMenu,                            value: 'back_menu' },
      ]), 350);
      return;
    }
    if (opt.value === 'menu_ask') {
      setStep('ask');
      setAllowInput(true);
      setTimeout(() => pushBot(t.ask), 350);
      return;
    }

    // Booking flow — pick dept → confirm
    if (opt.value.startsWith('book_dept_')) {
      const slug = opt.value.replace('book_dept_', '');
      const dept = HOSPITAL.departments.find(d => d.slug === slug);
      const docs = HOSPITAL.doctors.filter(d => d.department === slug);
      const text = docs.length
        ? `${dept.icon} ${dept.name} — we have ${docs.length} specialist${docs.length > 1 ? 's' : ''}: ${docs.map(d => d.name).join(', ')}.`
        : `${dept.icon} ${dept.name} — visiting consultants. We'll assign one at OPD.`;
      setTimeout(() => pushBot(text, [
        { label: t.bookCta,  value: `goto_book_${slug}` },
        { label: t.showDocs, value: `show_docs_${slug}` },
        { label: t.backMenu, value: 'back_menu' },
      ]), 350);
      return;
    }
    if (opt.value.startsWith('show_docs_')) {
      const slug = opt.value.replace('show_docs_', '');
      const docs = HOSPITAL.doctors.filter(d => d.department === slug);
      if (!docs.length) {
        setTimeout(() => pushBot('Visiting consultants only — please call us to confirm.', [{ label: t.backMenu, value: 'back_menu' }]), 350);
        return;
      }
      setTimeout(() => pushBot('Pick a doctor:', docs.map(d => ({
        label: `${d.name} — ₹${d.fee}`, value: `goto_book_${d.department}_${d.slug}`,
      })).concat([{ label: t.backMenu, value: 'back_menu' }])), 350);
      return;
    }
    if (opt.value.startsWith('goto_book_')) {
      const rest = opt.value.replace('goto_book_', '');
      const parts = rest.split('_');
      const slug = parts[0];
      const docSlug = parts.slice(1).join('_');
      const url = docSlug ? `/book-appointment?dept=${slug}&doctor=${docSlug}` : `/book-appointment?dept=${slug}`;
      setTimeout(() => pushBot('Opening booking page…'), 200);
      setTimeout(() => { navigate(url); setOpen(false); }, 600);
      return;
    }

    // Doctor flow — show profile then book
    if (opt.value.startsWith('doc_')) {
      const slug = opt.value.replace('doc_', '');
      const doc = HOSPITAL.doctors.find(d => d.slug === slug);
      if (!doc) return;
      const card =
        `👨‍⚕️ ${doc.name}\n${doc.specialty}\n${doc.qualifications}\n` +
        `Experience: ${doc.experience}+ yrs\nFee: ₹${doc.fee}\nTimings: ${doc.timings}`;
      setTimeout(() => pushBot(card, [
        { label: t.bookGen,  value: `goto_book_${doc.department}_${doc.slug}` },
        { label: t.backMenu, value: 'back_menu' },
      ]), 350);
      return;
    }

    // Dept info view
    if (opt.value.startsWith('view_dept_')) {
      const slug = opt.value.replace('view_dept_', '');
      const dept = HOSPITAL.departments.find(d => d.slug === slug);
      setTimeout(() => pushBot(`${dept.icon} ${dept.name}\n\n${dept.desc}`, [
        { label: t.bookGen,  value: `goto_book_${slug}` },
        { label: t.backMenu, value: 'back_menu' },
      ]), 350);
      return;
    }

    // Package selection
    if (opt.value.startsWith('pkg_')) {
      const idx = Number(opt.value.replace('pkg_', ''));
      const p = HOSPITAL.packages[idx];
      const card = `💊 ${p.name}\nPrice: ₹${p.price.toLocaleString('en-IN')} (was ₹${p.mrp.toLocaleString('en-IN')})\n\nIncludes:\n• ${p.tests.join('\n• ')}`;
      setTimeout(() => pushBot(card, [
        { label: t.bookGen,  value: 'goto_book_general-medicine' },
        { label: t.backMenu, value: 'back_menu' },
      ]), 350);
      return;
    }

    // Quick links
    if (opt.value === 'go_insurance') { navigate('/insurance'); setOpen(false); return; }
    if (opt.value === 'open_maps')    { window.open(HOSPITAL.contact.mapsLink, '_blank'); return; }
    if (opt.value === 'tel')          { window.location.href = `tel:${HOSPITAL.contact.emergencyRaw}`; return; }
  }

  // Quick-reply option builders
  function deptOptions(prefix) {
    return HOSPITAL.departments.map(d => ({
      label: `${d.icon} ${d.name}`,
      value: `${prefix}dept_${d.slug}`,
    })).concat([{ label: t.backMenu, value: 'back_menu' }]);
  }
  function doctorOptions() {
    return HOSPITAL.doctors.map(d => ({
      label: `${d.name} — ${d.specialty}`,
      value: `doc_${d.slug}`,
    })).concat([{ label: t.backMenu, value: 'back_menu' }]);
  }
  function packageOptions() {
    return HOSPITAL.packages.map((p, i) => ({
      label: `${p.name} (₹${p.price})`,
      value: `pkg_${i}`,
    })).concat([{ label: t.backMenu, value: 'back_menu' }]);
  }

  // ---------- free-text input → backend (Gemini stub) ----------
  async function sendText(e) {
    e?.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    setInput('');
    pushUser(text);
    setBusy(true);

    try {
      if (!API_BASE) {
        // Demo / no backend
        await new Promise(r => setTimeout(r, 700));
        pushBot(t.fallback, [{ label: t.backMenu, value: 'back_menu' }]);
      } else {
        const res = await fetch(`${API_BASE}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: text,
            lang: lang || 'en',
            history: messages.slice(-10).map(m => ({ role: m.from === 'bot' ? 'assistant' : 'user', content: m.text })),
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Error');
        pushBot(data.reply || t.fallback, [{ label: t.backMenu, value: 'back_menu' }]);
      }
    } catch (err) {
      pushBot('Sorry — something went wrong. ' + err.message, [{ label: t.backMenu, value: 'back_menu' }]);
    } finally {
      setBusy(false);
    }
  }

  // ---------- render ----------
  return (
    <>
      <button
        className={`fab fab-bot ${unread ? 'has-unread' : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Close chat' : 'Open chat assistant'}
      >
        {open ? <X size={24} /> : <Bot size={24} />}
        {!open && unread > 0 && <span className="fab-dot" aria-hidden="true" />}
      </button>

      <div className={`chat-panel ${open ? 'open' : ''}`} aria-hidden={!open}>
        <header className="chat-header">
          <div className="chat-avatar"><Bot size={22} /></div>
          <div className="chat-meta">
            <strong>{t.botName}</strong>
            <span><span className="online-dot" /> {t.online}</span>
          </div>
          <button className="chat-icon-btn" onClick={reset} aria-label="Reset chat" title="Reset">
            <RotateCcw size={18} />
          </button>
          <button className="chat-icon-btn" onClick={() => setOpen(false)} aria-label="Close chat">
            <X size={20} />
          </button>
        </header>

        <div className="chat-body" ref={scrollRef}>
          {messages.map((m, i) => {
            const isLast = i === messages.length - 1;
            return (
              <div key={m.ts + '-' + i} className={`chat-msg ${m.from}`}>
                {m.from === 'bot' && <div className="chat-msg-avatar"><Bot size={14} /></div>}
                <div className="chat-msg-bubble">
                  <div className="chat-msg-text">{m.text}</div>
                  {isLast && m.opts && (
                    <div className="chat-quickreplies">
                      {m.opts.map((opt, j) => (
                        <button key={j} className="chat-chip" onClick={() => handleOption(opt)} disabled={busy}>
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {busy && (
            <div className="chat-msg bot">
              <div className="chat-msg-avatar"><Bot size={14} /></div>
              <div className="chat-msg-bubble">
                <div className="chat-typing"><span /><span /><span /></div>
              </div>
            </div>
          )}
        </div>

        <form className="chat-input-row" onSubmit={sendText}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={allowInput ? t.typing : 'Tap an option above ↑'}
            disabled={!allowInput || busy}
            aria-label="Type a message"
          />
          <button type="submit" className="chat-send" disabled={!allowInput || busy || !input.trim()} aria-label="Send">
            <Send size={18} />
          </button>
        </form>

        <div className="chat-footer">
          <Sparkles size={12} /> {t.poweredAi}
        </div>
      </div>
    </>
  );
}
