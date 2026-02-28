import { useState, useEffect, useRef } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const moods = [
  { id: "radiant",   label: "Radiant",   emoji: "☀️", color: "#FFB347", bg: "#FFF3E0", dark: "#E65100" },
  { id: "calm",      label: "Calm",      emoji: "🌊", color: "#4FC3F7", bg: "#E1F5FE", dark: "#0277BD" },
  { id: "focused",   label: "Focused",   emoji: "🎯", color: "#A5D6A7", bg: "#E8F5E9", dark: "#2E7D32" },
  { id: "tired",     label: "Tired",     emoji: "🌙", color: "#CE93D8", bg: "#F3E5F5", dark: "#6A1B9A" },
  { id: "anxious",   label: "Anxious",   emoji: "⚡", color: "#EF9A9A", bg: "#FFEBEE", dark: "#B71C1C" },
  { id: "motivated", label: "Motivated", emoji: "🔥", color: "#FFCC02", bg: "#FFFDE7", dark: "#F57F17" },
  { id: "sad",       label: "Sad",       emoji: "🌧️", color: "#90A4AE", bg: "#ECEFF1", dark: "#37474F" },
  { id: "scared",    label: "Scared",    emoji: "🫀", color: "#F48FB1", bg: "#FCE4EC", dark: "#880E4F" },
];

const affirmations = {
  radiant:   ["You are a force of nature today.", "Your light transforms every room.", "Today belongs to you."],
  calm:      ["Peace is your superpower.", "Still waters run deep — and so do you.", "Breathe. You are exactly where you need to be."],
  focused:   ["One step. Then another. You've got this.", "Your attention is your greatest asset.", "Clarity is courage."],
  tired:     ["Rest is productive. Honor your body.", "Even the sun sets to rise again.", "Tiredness means you've been giving your all."],
  anxious:   ["This feeling is temporary. You are not.", "Courage isn't the absence of fear — it's moving through it.", "You've survived every hard day so far."],
  motivated: ["Channel this energy into something extraordinary.", "The fire in you is real. Let it burn.", "You're unstoppable right now."],
  sad:       ["Tears water the seeds of your resilience.", "It's okay not to be okay — you're still here.", "Even heavy skies carry silver light."],
  scared:    ["Fear is a signal, not a sentence.", "Brave people feel scared and go anyway.", "You are safer than you think right now."],
};

const scheduleTemplates = {
  radiant: [
    { time: "06:30", task: "Morning stretch & gratitude journal", icon: "🌅", done: false },
    { time: "08:00", task: "Deep work session — creative projects", icon: "✨", done: false },
    { time: "12:00", task: "Nourishing lunch + short walk", icon: "🥗", done: false },
    { time: "14:00", task: "Collaborate & connect with others", icon: "🤝", done: false },
    { time: "17:00", task: "Celebrate today's wins", icon: "🏆", done: false },
    { time: "21:00", task: "Wind down, plan tomorrow", icon: "📝", done: false },
  ],
  calm: [
    { time: "07:00", task: "Slow morning, mindful tea ritual", icon: "🍵", done: false },
    { time: "09:00", task: "Gentle reading or learning", icon: "📖", done: false },
    { time: "12:30", task: "Quiet lunch, no screens", icon: "🌿", done: false },
    { time: "14:00", task: "Focused, low-pressure tasks", icon: "💧", done: false },
    { time: "18:00", task: "Evening walk in nature", icon: "🌲", done: false },
    { time: "21:00", task: "Meditation & early rest", icon: "🌙", done: false },
  ],
  focused: [
    { time: "06:00", task: "Cold shower + power breakfast", icon: "💪", done: false },
    { time: "07:00", task: "2-hour deep work block", icon: "🎯", done: false },
    { time: "10:00", task: "Quick review + prioritize", icon: "📋", done: false },
    { time: "13:00", task: "Lunch + 20min walk", icon: "⚡", done: false },
    { time: "14:00", task: "Second deep work session", icon: "🔬", done: false },
    { time: "17:00", task: "Email & admin wrap-up", icon: "✅", done: false },
  ],
  tired: [
    { time: "08:00", task: "Gentle wake-up, no rush", icon: "☁️", done: false },
    { time: "10:00", task: "Handle only essential tasks", icon: "🌱", done: false },
    { time: "13:00", task: "Nutritious, comforting meal", icon: "🍲", done: false },
    { time: "15:00", task: "20-min power nap (if possible)", icon: "💤", done: false },
    { time: "17:00", task: "Light movement or stretching", icon: "🧘", done: false },
    { time: "20:00", task: "Early to bed — recovery matters", icon: "🛏️", done: false },
  ],
  anxious: [
    { time: "07:00", task: "4-7-8 breathing exercise", icon: "🫁", done: false },
    { time: "08:30", task: "Write down your worries (then close the notebook)", icon: "📓", done: false },
    { time: "11:00", task: "Small, achievable task — win early", icon: "🎯", done: false },
    { time: "13:00", task: "Walk + phone a friend", icon: "📞", done: false },
    { time: "16:00", task: "Create something with your hands", icon: "🎨", done: false },
    { time: "21:00", task: "Journaling + gratitude list", icon: "💛", done: false },
  ],
  motivated: [
    { time: "05:30", task: "Workout — push your limits", icon: "🏋️", done: false },
    { time: "07:00", task: "Plan your biggest goals for the day", icon: "🚀", done: false },
    { time: "08:00", task: "Tackle your hardest task first", icon: "🔥", done: false },
    { time: "12:00", task: "Fast refuel, keep momentum", icon: "⚡", done: false },
    { time: "13:00", task: "Pursue a stretch goal", icon: "🏹", done: false },
    { time: "19:00", task: "Reflect on impact made today", icon: "🌟", done: false },
  ],
  sad: [
    { time: "09:00", task: "Wrap yourself in warmth — tea, blanket, sunlight", icon: "☕", done: false },
    { time: "11:00", task: "A short, gentle walk outside", icon: "🌤️", done: false },
    { time: "13:00", task: "Comforting meal — something you love", icon: "🍜", done: false },
    { time: "15:00", task: "Write or draw how you feel — no filter", icon: "🖊️", done: false },
    { time: "18:00", task: "Connect with someone who cares about you", icon: "💙", done: false },
    { time: "21:00", task: "Gentle music & early rest", icon: "🎵", done: false },
  ],
  scared: [
    { time: "07:00", task: "5-4-3-2-1 grounding exercise", icon: "🌱", done: false },
    { time: "09:00", task: "Identify what you can control today", icon: "🧭", done: false },
    { time: "12:00", task: "Call someone you trust", icon: "📱", done: false },
    { time: "14:00", task: "One small brave action", icon: "🦁", done: false },
    { time: "17:00", task: "Warm bath or calming routine", icon: "🛁", done: false },
    { time: "21:00", task: "Write 3 things that went okay today", icon: "✏️", done: false },
  ],
};

const quotes = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "You are never too old to set another goal or dream a new dream.", author: "C.S. Lewis" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "Act as if what you do makes a difference. It does.", author: "William James" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
];

const avatars = [
  { id: "luna",  name: "Luna",  emoji: "🌙", role: "Gentle Healer",   color: "#9C88FF", bg: "#F0EEFF", gradient: "linear-gradient(135deg, #9C88FF, #6C5CE7)" },
  { id: "sol",   name: "Sol",   emoji: "☀️", role: "Energy Coach",    color: "#FDCB6E", bg: "#FFF8E1", gradient: "linear-gradient(135deg, #FDCB6E, #E17055)" },
  { id: "river", name: "River", emoji: "🌊", role: "Mindful Guide",   color: "#00B894", bg: "#E8FFF8", gradient: "linear-gradient(135deg, #55EFC4, #00B894)" },
  { id: "spark", name: "Spark", emoji: "⚡", role: "Action Catalyst", color: "#FF6B9D", bg: "#FFF0F5", gradient: "linear-gradient(135deg, #FF6B9D, #C44569)" },
];

const DISTRESS_MOODS = ["anxious", "sad", "scared", "tired"];

// ─── TYPING TEXT ─────────────────────────────────────────────────────────────
function TypingText({ text, onDone }) {
  const [displayed, setDisplayed] = useState("");
  const [idx, setIdx] = useState(0);
  const ref = useRef(null);

  useEffect(() => { setDisplayed(""); setIdx(0); }, [text]);

  useEffect(() => {
    if (idx < text.length) {
      const delay = [".", "!", "?", ","].includes(text[idx]) ? 55 : 16;
      ref.current = setTimeout(() => { setDisplayed(p => p + text[idx]); setIdx(i => i + 1); }, delay);
    } else if (idx > 0 && idx === text.length) { onDone?.(); }
    return () => clearTimeout(ref.current);
  }, [idx, text]);

  return <span>{displayed}{idx < text.length && <span style={{ animation: "blink 0.7s step-end infinite", opacity: 0.6 }}>|</span>}</span>;
}

// ─── AVATAR FACE ─────────────────────────────────────────────────────────────
function AvatarFace({ av, isTalking, isThinking, size = 80 }) {
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <div style={{
        width: size, height: size, borderRadius: "50%",
        background: av.gradient,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: size * 0.44,
        animation: isTalking ? "avatarTalk 0.45s ease-in-out infinite alternate"
          : isThinking ? "avatarThink 1.6s ease-in-out infinite"
          : "avatarIdle 3.5s ease-in-out infinite",
        boxShadow: isTalking
          ? `0 0 0 5px ${av.color}33, 0 0 30px ${av.color}55`
          : `0 4px 20px ${av.color}44`,
        transition: "box-shadow 0.4s ease",
        userSelect: "none",
      }}>
        {av.emoji}
      </div>
      {isThinking && (
        <div style={{
          position: "absolute", top: -4, right: -4,
          width: 22, height: 22, borderRadius: "50%",
          background: "white", border: `2px solid ${av.color}`,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10,
        }}>💭</div>
      )}
      {isTalking && (
        <div style={{
          position: "absolute", bottom: -6, left: "50%", transform: "translateX(-50%)",
          display: "flex", gap: 3, alignItems: "flex-end",
        }}>
          {[1, 2.5, 1.5, 2, 1].map((h, i) => (
            <div key={i} style={{
              width: 4, height: h * 5, background: av.color, borderRadius: 2,
              animation: `soundBar 0.5s ease-in-out ${i * 0.1}s infinite alternate`,
            }} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── AI COMPANION ────────────────────────────────────────────────────────────
function AICompanion({ mood, currentAvatar, onAvatarChange }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTalking, setIsTalking] = useState(false);
  const [talkingId, setTalkingId] = useState(null);
  const [apiKey, setApiKey] = useState("");
  const [savedKey, setSavedKey] = useState("");
  const [showKeyInput, setShowKeyInput] = useState(false);
  const endRef = useRef(null);
  const av = avatars.find(a => a.id === currentAvatar) || avatars[0];
  const moodData = moods.find(m => m.id === mood);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  // Auto-greet on distress mood
  useEffect(() => {
    if (DISTRESS_MOODS.includes(mood)) {
      const greets = {
        anxious: `Hey there, I'm ${av.name}. I notice you're feeling anxious — that's really tough. You're safe here with me. What's swirling around in your mind right now?`,
        sad:     `Hi, I'm ${av.name}. Sadness is heavy, and I want you to know you don't have to carry it alone. I'm right here. What's weighing on your heart?`,
        scared:  `Hello, I'm ${av.name}. Fear can feel so consuming — but you reached out, which already took courage. Tell me what's frightening you?`,
        tired:   `Hi, I'm ${av.name}. Running on empty is one of the hardest feelings. You deserve real rest and care. Want to talk about what's draining you?`,
      };
      const msg = { role: "assistant", text: greets[mood] || `Hi, I'm ${av.name}. I'm here for you.`, id: Date.now() };
      setMessages([msg]);
      setIsTalking(true);
      setTalkingId(msg.id);
    } else {
      setMessages([]);
    }
  }, [mood, currentAvatar]);

  const sendMessage = async () => {
    const key = savedKey;
    if (!input.trim()) return;
    if (!key) { setShowKeyInput(true); return; }

    const userMsg = { role: "user", text: input.trim(), id: Date.now() };
    const history = [...messages, userMsg];
    setMessages(history);
    setInput("");
    setLoading(true);

    const systemPrompt = `You are ${av.name}, a compassionate AI wellness companion with the persona: "${av.role}".
The user is currently feeling: ${mood}.
Your voice is warm, specific, and human. Never use bullet lists. Respond in 2–4 flowing sentences.
Always end with ONE clear, gentle action they can take right now.
If they seem in crisis, compassionately mention that professional support is available.
Never be preachy or clinical. Be a caring, wise friend.`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 350,
          system: systemPrompt,
          messages: history.map(m => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.text })),
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      const reply = data.content?.[0]?.text || "I'm still right here with you.";
      const newMsg = { role: "assistant", text: reply, id: Date.now() };
      setMessages(prev => [...prev, newMsg]);
      setIsTalking(true);
      setTalkingId(newMsg.id);
    } catch (e) {
      const errMsg = { role: "assistant", text: "I had a hiccup connecting, but I haven't gone anywhere. Try again in a moment?", id: Date.now(), error: true };
      setMessages(prev => [...prev, errMsg]);
    } finally { setLoading(false); }
  };

  const quickPrompts = ["I feel overwhelmed", "Help me calm down", "I don't know what to do", "Tell me it'll be okay"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>

      {/* Avatar Picker */}
      <div>
        <p style={{ margin: "0 0 10px", fontSize: "11px", color: "#888", letterSpacing: "2px", textTransform: "uppercase" }}>Choose your companion</p>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          {avatars.map(a => (
            <button key={a.id} onClick={() => onAvatarChange(a.id)} title={`${a.name} — ${a.role}`} style={{
              width: 54, height: 54, borderRadius: "50%",
              background: a.gradient, border: currentAvatar === a.id ? "3px solid #1a1a1a" : "3px solid transparent",
              cursor: "pointer", fontSize: 22,
              boxShadow: currentAvatar === a.id ? `0 4px 18px ${a.color}88` : "none",
              transition: "all 0.2s ease",
              transform: currentAvatar === a.id ? "scale(1.12)" : "scale(1)",
            }}>{a.emoji}</button>
          ))}
        </div>
        <p style={{ margin: "8px 0 0", fontSize: "14px", color: av.color, fontWeight: "700" }}>
          {av.name} <span style={{ color: "#aaa", fontWeight: "400" }}>· {av.role}</span>
        </p>
      </div>

      {/* API Key Setup */}
      {!savedKey && (
        <div style={{
          background: `linear-gradient(135deg, ${av.color}12, ${av.color}06)`,
          border: `1px solid ${av.color}33`, borderRadius: 18, padding: 18,
        }}>
          {!showKeyInput ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>{av.emoji}</div>
              <p style={{ margin: "0 0 14px", fontSize: 15, color: "#555", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", lineHeight: 1.6 }}>
                Connect your Anthropic API key to have real conversations with {av.name}.
              </p>
              <button onClick={() => setShowKeyInput(true)} style={{
                padding: "11px 26px", borderRadius: "100px",
                background: av.gradient, border: "none",
                color: "white", fontWeight: "700", fontSize: 14,
                cursor: "pointer", letterSpacing: "0.5px",
                boxShadow: `0 4px 16px ${av.color}55`,
              }}>✦ Connect API Key</button>
              <p style={{ margin: "10px 0 0", fontSize: 11, color: "#aaa" }}>Key is stored in this session only</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <p style={{ margin: 0, fontSize: 13, color: "#555", fontWeight: "600" }}>Enter your Anthropic API key:</p>
              <input type="password" value={apiKey} onChange={e => setApiKey(e.target.value)}
                onKeyDown={e => e.key === "Enter" && (() => { setSavedKey(apiKey); setShowKeyInput(false); })()}
                placeholder="sk-ant-api..."
                style={{
                  padding: "11px 14px", borderRadius: 12, border: "1px solid #ddd",
                  fontSize: 13, outline: "none", fontFamily: "monospace",
                  background: "#fafafa",
                }} />
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => { setSavedKey(apiKey); setShowKeyInput(false); }} style={{
                  flex: 1, padding: 11, borderRadius: 12, background: av.gradient,
                  border: "none", color: "white", fontWeight: "700", fontSize: 14, cursor: "pointer",
                }}>Save & Connect</button>
                <button onClick={() => setShowKeyInput(false)} style={{
                  padding: "11px 16px", borderRadius: 12, background: "#f0f0f0",
                  border: "none", cursor: "pointer", color: "#666",
                }}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Chat Window */}
      <div style={{
        background: "#FAFAFA", borderRadius: 22, border: "1px solid #efefef",
        overflow: "hidden", display: "flex", flexDirection: "column",
        minHeight: 360, maxHeight: 500,
        boxShadow: "0 8px 40px rgba(0,0,0,0.06)",
      }}>
        {/* Chat Header */}
        <div style={{
          padding: "16px 18px", background: av.gradient,
          display: "flex", alignItems: "center", gap: 14,
        }}>
          <AvatarFace av={av} isTalking={isTalking} isThinking={loading} size={72} />
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontSize: 18, fontWeight: "700", color: "white" }}>{av.name}</p>
            <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.8)" }}>{av.role}</p>
            {moodData && (
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 4, marginTop: 4,
                padding: "3px 10px", borderRadius: 100, background: "rgba(255,255,255,0.2)",
              }}>
                <span style={{ fontSize: 12 }}>{moodData.emoji}</span>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.9)", fontWeight: "600" }}>
                  Tuned for: {moodData.label}
                </span>
              </div>
            )}
          </div>
          {savedKey && (
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#55EFC4", animation: "pulse 2s ease-in-out infinite" }} />
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.8)" }}>Live</span>
            </div>
          )}
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: 12 }}>
          {messages.length === 0 && !loading && (
            <div style={{ textAlign: "center", padding: "32px 0" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>{av.emoji}</div>
              <p style={{ color: "#bbb", fontSize: 14, fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic" }}>
                {savedKey ? `${av.name} is listening...` : "Connect your API key to begin"}
              </p>
            </div>
          )}

          {messages.map(msg => (
            <div key={msg.id} style={{
              display: "flex", flexDirection: msg.role === "user" ? "row-reverse" : "row",
              gap: 10, alignItems: "flex-end",
            }}>
              {msg.role === "assistant" && (
                <div style={{
                  width: 30, height: 30, borderRadius: "50%", background: av.gradient,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14, flexShrink: 0,
                }}>{av.emoji}</div>
              )}
              <div style={{
                maxWidth: "80%", padding: "12px 16px",
                borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                background: msg.role === "user" ? "#1a1a1a" : "white",
                border: msg.role === "assistant" ? "1px solid #eee" : "none",
                boxShadow: msg.role === "assistant" ? "0 2px 12px rgba(0,0,0,0.06)" : "none",
                fontSize: 14, lineHeight: 1.65,
                color: msg.role === "user" ? "white" : "#2d2d2d",
              }}>
                {msg.role === "assistant" && msg.id === talkingId ? (
                  <TypingText text={msg.text} onDone={() => { setIsTalking(false); setTalkingId(null); }} />
                ) : msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
              <div style={{
                width: 30, height: 30, borderRadius: "50%", background: av.gradient,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
              }}>{av.emoji}</div>
              <div style={{
                padding: "12px 16px", borderRadius: "18px 18px 18px 4px",
                background: "white", border: "1px solid #eee",
                display: "flex", gap: 5, alignItems: "center",
              }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    width: 8, height: 8, borderRadius: "50%", background: av.color,
                    animation: `dotBounce 1s ease-in-out ${i * 0.2}s infinite`,
                  }} />
                ))}
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Quick Prompts */}
        {savedKey && messages.length <= 1 && (
          <div style={{ padding: "0 12px 8px", display: "flex", gap: 6, flexWrap: "wrap" }}>
            {quickPrompts.map(qp => (
              <button key={qp} onClick={() => setInput(qp)} style={{
                padding: "6px 12px", borderRadius: "100px",
                background: `${av.color}18`, border: `1px solid ${av.color}44`,
                fontSize: 12, color: av.color, cursor: "pointer", fontWeight: "600",
              }}>{qp}</button>
            ))}
          </div>
        )}

        {/* Input */}
        <div style={{
          padding: 12, borderTop: "1px solid #eee",
          display: "flex", gap: 8, alignItems: "flex-end", background: "white",
        }}>
          <textarea value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder={savedKey ? `Talk to ${av.name}...` : "Connect API key above to chat"}
            disabled={!savedKey || loading} rows={1}
            style={{
              flex: 1, padding: "10px 14px", borderRadius: 12,
              border: "1px solid #eee", fontSize: 14, outline: "none",
              resize: "none", lineHeight: 1.4, fontFamily: "inherit",
              background: savedKey ? "white" : "#f8f8f8",
              transition: "border 0.2s", color: "#1a1a1a",
            }} />
          <button onClick={sendMessage} disabled={!savedKey || loading || !input.trim()} style={{
            width: 40, height: 40, borderRadius: "50%",
            background: savedKey && input.trim() ? av.gradient : "#eee",
            border: "none", cursor: savedKey && input.trim() ? "pointer" : "not-allowed",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, transition: "all 0.2s", flexShrink: 0,
            color: savedKey && input.trim() ? "white" : "#bbb",
          }}>↑</button>
        </div>
      </div>

      {/* Controls */}
      {savedKey && (
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setMessages([])} style={{
            flex: 1, padding: "9px 12px", borderRadius: 10, background: "transparent",
            border: "1px solid #eee", fontSize: 12, color: "#888", cursor: "pointer",
          }}>Clear chat</button>
          <button onClick={() => setSavedKey("")} style={{
            flex: 1, padding: "9px 12px", borderRadius: 10, background: "transparent",
            border: "1px solid #eee", fontSize: 12, color: "#888", cursor: "pointer",
          }}>Change key</button>
        </div>
      )}
    </div>
  );
}

// ─── DISTRESS BANNER ─────────────────────────────────────────────────────────
function DistressBanner({ mood, onTalkToCompanion }) {
  const moodData = moods.find(m => m.id === mood);
  if (!DISTRESS_MOODS.includes(mood)) return null;
  const msgs = {
    anxious: "Anxiety can feel overwhelming. Your AI companion is ready to guide you back to calm.",
    sad:     "Sadness is valid. Let your companion sit with you through this.",
    scared:  "Fear is telling you something. Your companion will help you listen safely.",
    tired:   "Deep exhaustion needs gentle care. Your companion has a plan for you.",
  };
  return (
    <div style={{
      background: `linear-gradient(135deg, ${moodData.bg}, #fff8f8)`,
      border: `1px solid ${moodData.color}55`, borderRadius: 18, padding: 18,
      display: "flex", flexDirection: "column", gap: 14,
      animation: "slideUp 0.4s ease",
    }}>
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <span style={{ fontSize: 30 }}>{moodData.emoji}</span>
        <p style={{ margin: 0, fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 17, lineHeight: 1.6, color: moodData.dark }}>
          {msgs[mood]}
        </p>
      </div>
      <button onClick={onTalkToCompanion} style={{
        padding: "13px 22px", borderRadius: "100px",
        background: moodData.color, border: "none", color: "white",
        fontWeight: "700", fontSize: 14, cursor: "pointer", letterSpacing: "0.5px",
        boxShadow: `0 4px 20px ${moodData.color}55`,
      }}>
        💬 Talk to my AI Companion
      </button>
    </div>
  );
}

// ─── EXISTING COMPONENTS ─────────────────────────────────────────────────────
function BreathingOrb({ mood }) {
  const moodData = moods.find(m => m.id === mood) || moods[0];
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, margin: "10px 0" }}>
      <div style={{
        width: 110, height: 110, borderRadius: "50%",
        background: `radial-gradient(circle at 35% 35%, ${moodData.color}CC, ${moodData.color}44)`,
        boxShadow: `0 0 40px ${moodData.color}66, 0 0 80px ${moodData.color}22`,
        animation: "breathe 4s ease-in-out infinite",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 44, transition: "all 0.5s ease",
      }}>{moodData.emoji}</div>
      <span style={{ fontSize: 11, color: "#888", letterSpacing: "2px", textTransform: "uppercase" }}>breathe with me</span>
    </div>
  );
}

function MoodSelector({ selectedMood, onSelect }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <p style={{ color: "#666", margin: "0 0 6px", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 17 }}>
        How are you feeling right now?
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
        {moods.map(m => (
          <button key={m.id} onClick={() => onSelect(m.id)} style={{
            padding: "10px 4px", borderRadius: 14,
            border: selectedMood === m.id ? `2px solid ${m.color}` : "2px solid transparent",
            background: selectedMood === m.id ? m.bg : "#F8F8F8",
            cursor: "pointer", transition: "all 0.25s ease",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
            transform: selectedMood === m.id ? "scale(1.06)" : "scale(1)",
            boxShadow: selectedMood === m.id ? `0 6px 20px ${m.color}44` : "none",
          }}>
            <span style={{ fontSize: 20 }}>{m.emoji}</span>
            <span style={{ fontSize: 10, fontWeight: "600", color: selectedMood === m.id ? m.dark : "#666" }}>{m.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function AffirmationCard({ mood }) {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const moodData = moods.find(m => m.id === mood);
  const list = affirmations[mood] || affirmations.radiant;
  useEffect(() => { setIdx(0); setVisible(true); }, [mood]);
  const next = () => { setVisible(false); setTimeout(() => { setIdx(i => (i + 1) % list.length); setVisible(true); }, 300); };
  if (!moodData) return null;
  return (
    <div style={{
      background: `linear-gradient(135deg, ${moodData.bg}, white)`,
      borderRadius: 20, padding: 22, border: `1px solid ${moodData.color}55`,
      position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: `${moodData.color}22` }} />
      <p style={{
        fontFamily: "'Cormorant Garamond', serif", fontSize: 21, lineHeight: 1.55,
        color: moodData.dark, margin: "0 0 14px",
        opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(8px)",
        transition: "all 0.3s ease", fontStyle: "italic",
      }}>"{list[idx]}"</p>
      <button onClick={next} style={{
        background: moodData.color, border: "none", borderRadius: "100px",
        padding: "7px 18px", fontSize: 12, fontWeight: "700",
        color: "white", cursor: "pointer", letterSpacing: "1px", textTransform: "uppercase",
      }}>Next ✦</button>
    </div>
  );
}

function ScheduleBlock({ mood }) {
  const [tasks, setTasks] = useState([]);
  const moodData = moods.find(m => m.id === mood);
  useEffect(() => { setTasks((scheduleTemplates[mood] || scheduleTemplates.radiant).map(t => ({ ...t }))); }, [mood]);
  const toggle = i => setTasks(prev => prev.map((t, idx) => idx === i ? { ...t, done: !t.done } : t));
  const pct = tasks.length ? Math.round(tasks.filter(t => t.done).length / tasks.length * 100) : 0;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h3 style={{ margin: 0, fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: "#1a1a1a" }}>Today's Flow</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 60, height: 6, borderRadius: 3, background: "#eee", overflow: "hidden" }}>
            <div style={{ width: `${pct}%`, height: "100%", background: moodData?.color || "#888", transition: "width 0.4s ease", borderRadius: 3 }} />
          </div>
          <span style={{ fontSize: 12, color: "#888", fontWeight: "600" }}>{pct}%</span>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {tasks.map((task, i) => (
          <div key={i} onClick={() => toggle(i)} style={{
            display: "flex", alignItems: "center", gap: 14,
            padding: "13px 16px", borderRadius: 14,
            background: task.done ? `${moodData?.color}15` : "#F9F9F9",
            border: task.done ? `1px solid ${moodData?.color}44` : "1px solid #eee",
            cursor: "pointer", transition: "all 0.25s ease", opacity: task.done ? 0.7 : 1,
          }}>
            <div style={{
              width: 22, height: 22, borderRadius: "50%",
              border: `2px solid ${task.done ? moodData?.color : "#ccc"}`,
              background: task.done ? moodData?.color : "transparent",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, transition: "all 0.25s ease",
            }}>
              {task.done && <span style={{ color: "white", fontSize: 12, fontWeight: "bold" }}>✓</span>}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                <span style={{ fontSize: 12, color: "#888", fontWeight: "600" }}>{task.time}</span>
                <span style={{ fontSize: 12 }}>{task.icon}</span>
              </div>
              <p style={{ margin: 0, fontSize: 14, fontWeight: "500", color: task.done ? "#888" : "#222", textDecoration: task.done ? "line-through" : "none" }}>{task.task}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TimerWidget({ mood }) {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [preset, setPreset] = useState(1500);
  const intervalRef = useRef(null);
  const moodData = moods.find(m => m.id === mood);
  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setSeconds(s => { if (s >= preset) { setRunning(false); return s; } return s + 1; }), 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, preset]);
  const reset = () => { setRunning(false); setSeconds(0); };
  const fmt = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const remaining = Math.max(0, preset - seconds);
  const r = 44, circ = 2 * Math.PI * r;
  return (
    <div style={{ background: "#F8F8F8", borderRadius: 20, padding: 20, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <h3 style={{ margin: 0, fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: "#1a1a1a" }}>Focus Timer</h3>
      <div style={{ position: "relative", width: 120, height: 120 }}>
        <svg width="120" height="120" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="60" cy="60" r={r} fill="none" stroke="#E0E0E0" strokeWidth="6" />
          <circle cx="60" cy="60" r={r} fill="none" stroke={moodData?.color || "#888"} strokeWidth="6"
            strokeDasharray={circ} strokeDashoffset={circ * (1 - seconds / preset)} strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1s linear" }} />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 22, fontWeight: "700", fontFamily: "monospace", color: "#1a1a1a" }}>{fmt(remaining)}</span>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        {[{ l: "5m", v: 300 }, { l: "25m", v: 1500 }, { l: "45m", v: 2700 }].map(p => (
          <button key={p.l} onClick={() => { setPreset(p.v); setSeconds(0); setRunning(false); }} style={{
            padding: "6px 14px", borderRadius: "100px",
            border: preset === p.v ? `2px solid ${moodData?.color}` : "2px solid #ddd",
            background: preset === p.v ? `${moodData?.color}22` : "white",
            fontSize: 12, fontWeight: "700", cursor: "pointer",
            color: preset === p.v ? moodData?.dark : "#666",
          }}>{p.l}</button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={() => setRunning(r => !r)} style={{
          padding: "10px 28px", borderRadius: "100px", background: moodData?.color || "#888",
          border: "none", color: "white", fontWeight: "700", fontSize: 14, cursor: "pointer",
        }}>{running ? "Pause" : "Start"}</button>
        <button onClick={reset} style={{
          padding: "10px 20px", borderRadius: "100px", background: "transparent",
          border: "2px solid #ddd", fontWeight: "600", fontSize: 14, cursor: "pointer", color: "#888",
        }}>Reset</button>
      </div>
    </div>
  );
}

function QuoteOfDay() {
  const [q] = useState(() => quotes[Math.floor(Math.random() * quotes.length)]);
  return (
    <div style={{ padding: "18px 20px", borderLeft: "3px solid #1a1a1a", background: "#FAFAFA", borderRadius: "0 12px 12px 0" }}>
      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, lineHeight: 1.6, color: "#333", margin: "0 0 6px", fontStyle: "italic" }}>"{q.text}"</p>
      <span style={{ fontSize: 12, color: "#888", fontWeight: "600", letterSpacing: "1px" }}>— {q.author}</span>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function MoodFlowApp() {
  const [mood, setMood] = useState("radiant");
  const [tab, setTab] = useState("mood");
  const [avatar, setAvatar] = useState("luna");
  const moodData = moods.find(m => m.id === mood);

  const tabs = [
    { id: "mood",      label: "Mood",      icon: "✦" },
    { id: "companion", label: "Companion", icon: "💬" },
    { id: "schedule",  label: "Schedule",  icon: "◈" },
    { id: "focus",     label: "Focus",     icon: "◎" },
  ];

  return (
    <div style={{
      fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
      minHeight: "100vh",
      background: `linear-gradient(160deg, ${moodData?.bg || "#FFF3E0"} 0%, #FFFFFF 60%)`,
      transition: "background 0.7s ease",
      display: "flex", justifyContent: "center",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes breathe { 0%,100%{transform:scale(1)} 50%{transform:scale(1.1)} }
        @keyframes slideUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes avatarIdle { 0%,100%{transform:translateY(0) rotate(0deg)} 33%{transform:translateY(-5px) rotate(1deg)} 66%{transform:translateY(-2px) rotate(-1deg)} }
        @keyframes avatarTalk { 0%{transform:scale(1)} 100%{transform:scale(1.06)} }
        @keyframes avatarThink { 0%,100%{transform:rotate(-4deg) scale(0.96)} 50%{transform:rotate(4deg) scale(1.03)} }
        @keyframes soundBar { from{transform:scaleY(0.3)} to{transform:scaleY(1.3)} }
        @keyframes dotBounce { 0%,80%,100%{transform:scale(0.5);opacity:0.3} 40%{transform:scale(1.3);opacity:1} }
        @keyframes blink { 50%{opacity:0} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        *{box-sizing:border-box} ::-webkit-scrollbar{width:0}
      `}</style>

      <div style={{ width: "100%", maxWidth: 432, minHeight: "100vh", display: "flex", flexDirection: "column" }}>

        {/* Header */}
        <div style={{ padding: "44px 24px 14px", animation: "slideUp 0.5s ease" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <p style={{ margin: "0 0 3px", fontSize: 11, letterSpacing: "3px", color: "#888", textTransform: "uppercase" }}>
                {new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
              </p>
              <h1 style={{ margin: 0, fontSize: 34, fontFamily: "'Cormorant Garamond', serif", fontWeight: "600", color: "#1a1a1a", lineHeight: 1.1 }}>
                MoodFlow
              </h1>
            </div>
            <div style={{
              padding: "9px 14px", borderRadius: "100px",
              background: `${moodData?.color}22`, border: `1px solid ${moodData?.color}55`,
              fontSize: 12, fontWeight: "700", color: moodData?.dark,
              letterSpacing: "1px", textTransform: "uppercase", transition: "all 0.4s ease",
            }}>
              {moodData?.emoji} {moodData?.label}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 3, padding: "0 24px 14px" }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, padding: "9px 4px", borderRadius: 12, border: "none",
              background: tab === t.id ? "#1a1a1a" : "transparent",
              color: tab === t.id ? "white" : "#888",
              fontWeight: "600", fontSize: 12, cursor: "pointer", transition: "all 0.2s ease",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
            }}>
              <span style={{ fontSize: 14 }}>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: "0 24px 80px", display: "flex", flexDirection: "column", gap: 18, animation: "slideUp 0.35s ease" }}>

          {tab === "mood" && (
            <>
              <MoodSelector selectedMood={mood} onSelect={setMood} />
              <DistressBanner mood={mood} onTalkToCompanion={() => setTab("companion")} />
              <BreathingOrb mood={mood} />
              <AffirmationCard mood={mood} />
              <QuoteOfDay />
            </>
          )}

          {tab === "companion" && (
            <>
              <div>
                <h2 style={{ margin: "0 0 3px", fontFamily: "'Cormorant Garamond', serif", fontSize: 26, color: "#1a1a1a" }}>AI Companion</h2>
                <p style={{ margin: 0, fontSize: 13, color: "#888", lineHeight: 1.5 }}>Powered by Claude · Emotionally aware · Always here</p>
              </div>
              <AICompanion mood={mood} currentAvatar={avatar} onAvatarChange={setAvatar} />
            </>
          )}

          {tab === "schedule" && <ScheduleBlock mood={mood} />}

          {tab === "focus" && (
            <>
              <TimerWidget mood={mood} />
              <AffirmationCard mood={mood} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}