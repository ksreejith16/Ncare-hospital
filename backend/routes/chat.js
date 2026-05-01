// =========================================================
//   Chatbot endpoint — Gemini-ready stub.
//   POST /api/chat   { message, lang, history } → { reply }
//
//   When GEMINI_API_KEY is set, calls Gemini API.
//   When unset, returns a friendly fallback message.
// =========================================================

import express from 'express';

const router = express.Router();

const GEMINI_KEY   = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

const HOSPITAL_PHONE = process.env.HOSPITAL_PHONE || '+91 40 6162 6364';

// System prompt — keeps the bot helpful, scoped, and safe.
const SYSTEM_PROMPT = `
You are the friendly assistant for N Care Hospital, a 50-bed NABH-accredited
multi-specialty hospital in Beeramguda, R.C. Puram, Hyderabad.

Hospital facts:
- Address: 25-26, Mayuri Nagar, R.C. Puram, Patancheru Mandal Office, Beeramguda, Hyderabad — 502032
- Phone / Emergency: ${HOSPITAL_PHONE} (24×7)
- OPD hours: Mon – Sat, 11:00 AM – 4:30 PM
- Specialties (12): Orthopedics, Obstetrics & Gynecology, Dermatology, Cardiology,
  General Medicine, General Surgery, Pediatrics, Urology, ENT, Neurosurgery,
  Physiotherapy, Diabetology
- Facilities: 24×7 Emergency, ICU/SICU, 2 modular OTs (laminar flow),
  in-house pharmacy, sophisticated lab, digital X-ray, physiotherapy.

Rules:
1. Be warm, concise, and respectful. 2–4 short sentences per reply ideally.
2. Reply in the user's language (English / Telugu / Hindi).
3. NEVER provide medical diagnosis, treatment plans, or drug dosages.
   For any clinical question, recommend they consult a doctor at the hospital.
4. If user describes a possible emergency (chest pain, severe bleeding,
   unconscious, severe breathing issues, stroke symptoms), urgently advise
   them to call ${HOSPITAL_PHONE} or 108 immediately.
5. If the user wants to book, point them to the booking page on the website.
6. If unsure, ask a clarifying question.
7. Do not make up doctor names, prices, or facts. Use only what's listed above.
`;

const RED_FLAGS = [
  'chest pain', 'unconscious', 'not breathing', 'heart attack', 'stroke',
  'severe bleeding', 'overdose', 'suicide', 'seizure', 'severely injured',
];

function looksLikeEmergency(text = '') {
  const t = text.toLowerCase();
  return RED_FLAGS.some(rf => t.includes(rf));
}

router.post('/', async (req, res) => {
  try {
    const { message = '', lang = 'en', history = [] } = req.body || {};
    if (!message.trim()) return res.status(400).json({ message: 'Empty message' });

    // Always intercept emergencies first.
    if (looksLikeEmergency(message)) {
      const reply =
        lang === 'te'
          ? `🚨 ఇది వైద్య అత్యవసర పరిస్థితిలా అనిపిస్తోంది. దయచేసి వెంటనే మాకు ${HOSPITAL_PHONE} కి కాల్ చేయండి లేదా 108 డయల్ చేయండి.`
        : lang === 'hi'
          ? `🚨 यह चिकित्सा आपातकाल जैसा लग रहा है। कृपया तुरंत हमें ${HOSPITAL_PHONE} पर कॉल करें या 108 डायल करें।`
        : `🚨 This sounds like a medical emergency. Please call us immediately at ${HOSPITAL_PHONE} or dial 108.`;
      return res.json({ reply, emergency: true });
    }

    // No Gemini key → return fallback.
    if (!GEMINI_KEY) {
      const reply =
        lang === 'te'
          ? `క్షమించండి, నా AI అసిస్టెంట్ ఇంకా కనెక్ట్ చేయబడలేదు. దయచేసి మెను నుండి ఎంచుకోండి లేదా ${HOSPITAL_PHONE} కి కాల్ చేయండి.`
        : lang === 'hi'
          ? `माफ़ कीजिए, मेरा AI सहायक अभी कनेक्ट नहीं है। कृपया मेनू से चुनें या ${HOSPITAL_PHONE} पर कॉल करें।`
        : `My AI brain isn't fully connected yet. For now, please pick an option from the menu or call us at ${HOSPITAL_PHONE} — we'll be happy to help.`;
      return res.json({ reply, mode: 'stub' });
    }

    // Call Gemini.
    const langName = lang === 'te' ? 'Telugu' : lang === 'hi' ? 'Hindi' : 'English';
    const contents = [
      ...history.slice(-8).map(h => ({
        role: h.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: h.content }],
      })),
      { role: 'user', parts: [{ text: message }] },
    ];

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_KEY}`;
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT + `\n\nReply in: ${langName}.` }] },
        contents,
        generationConfig: { temperature: 0.4, maxOutputTokens: 240 },
        safetySettings: [
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        ],
      }),
    });
    const data = await resp.json();
    if (!resp.ok) {
      console.error('[chat] gemini error', data);
      return res.status(502).json({ message: 'AI service unavailable. Please call us or try later.' });
    }
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
      || `Sorry — I couldn't fetch an answer. Please call us at ${HOSPITAL_PHONE}.`;
    res.json({ reply, mode: 'gemini' });
  } catch (err) {
    console.error('[chat] error', err);
    res.status(500).json({ message: 'Chat service error' });
  }
});

export default router;
