import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const LG = "linear-gradient(135deg,#F5E0A0 0%,#E8B870 20%,#BFA5D8 52%,#2CB7A7 78%,#167A6B 100%)";

// All 24 SHG categories with slide backgrounds + sample carousel content
const CATEGORIES = [
  {
    id: "lovemaxxing",
    name: "Lovemaxxing",
    bg: "#F2C8C0",
    hook: "You are already the woman he can't stop thinking about.",
    affirmations: [
      "I am deeply loved by someone who chooses me every day.",
      "My presence alone makes him think of me.",
      "I receive love as naturally as I breathe.",
      "The right man sees me clearly and stays.",
      "Love comes to me without effort or force.",
      "He notices me. He remembers me. He wants me.",
      "I am someone he feels lucky to have found.",
      "My love story is already written and it's beautiful.",
    ],
  },
  {
    id: "beautymaxxing",
    name: "Beautymaxxing",
    bg: "#F0D0C8",
    hook: "Your face is already the face people remember.",
    affirmations: [
      "I am effortlessly beautiful and I know it.",
      "People notice me when I enter a room.",
      "My glow is natural and it only deepens.",
      "I look like the main character. Because I am.",
      "My skin is clear, radiant, and porcelain-perfect.",
      "Beauty is my resting state.",
      "I see my own beauty without effort or doubt.",
      "Everyone I meet thinks I look stunning.",
    ],
  },
  {
    id: "facemaxxing",
    name: "Facemaxxing",
    bg: "#F0C0C8",
    hook: "Your face was made to be unforgettable.",
    affirmations: [
      "My features are striking and I love them.",
      "My skin renews itself effortlessly every night.",
      "People are drawn to my face without knowing why.",
      "I look younger and fresher every single day.",
      "My face reflects the peace and beauty inside me.",
      "I am photogenic naturally. Every angle works.",
      "My eyes are the kind people can't look away from.",
      "My face is exactly what I want it to be.",
    ],
  },
  {
    id: "erosmaxxing",
    name: "Erosmaxxing",
    bg: "#E8B8C8",
    hook: "You are the kind of magnetic that stops rooms.",
    affirmations: [
      "I am irresistibly attractive to the right person.",
      "My energy alone pulls people toward me.",
      "I radiate a sensuality that is entirely my own.",
      "Desire follows me without me trying.",
      "I am deeply confident in my erotic energy.",
      "The right person is obsessed with me.",
      "My presence is felt before I even speak.",
      "I am magnetic, desirable, and completely at ease.",
    ],
  },
  {
    id: "stylemaxxing",
    name: "Stylemaxxing",
    bg: "#E8D0D8",
    hook: "You dress like the version of yourself who already made it.",
    affirmations: [
      "My style is a language that speaks before I do.",
      "I always know exactly what to wear.",
      "People remember the way I put myself together.",
      "My wardrobe reflects who I am becoming.",
      "I dress for the life I already live in my mind.",
      "Everything I wear looks like it was made for me.",
      "Style comes naturally to me. It always has.",
      "I am a woman with an unmistakable aesthetic.",
    ],
  },
  {
    id: "moneymaxxing",
    name: "Moneymaxxing",
    bg: "#E8D8B0",
    hook: "Money is not something you chase. It's something you receive.",
    affirmations: [
      "Money flows to me from expected and unexpected sources.",
      "I am a natural money magnet.",
      "My bank account reflects my worth.",
      "Wealth is my natural state of being.",
      "I make large amounts of money with ease.",
      "Opportunities to earn find me constantly.",
      "I handle money with grace, wisdom, and abundance.",
      "I am rich and getting richer every single day.",
    ],
  },
  {
    id: "businessmaxxing",
    name: "Businessmaxxing",
    bg: "#E0D0B0",
    hook: "Your business grows at the speed of your belief in it.",
    affirmations: [
      "My business attracts exactly the right clients.",
      "I make decisions from certainty, not anxiety.",
      "People pay premium prices for what I offer.",
      "My work finds its people effortlessly.",
      "I am a CEO who leads with calm and conviction.",
      "My business is profitable and constantly expanding.",
      "My income grows while I sleep.",
      "I am known for the transformation I create.",
    ],
  },
  {
    id: "desiresmaxxing",
    name: "Desiresmaxxing",
    bg: "#E8C0B8",
    hook: "Your desires arrive. That's just what they do.",
    affirmations: [
      "Everything I want is already moving toward me.",
      "My desires manifest quickly and perfectly.",
      "I am someone whose wishes come true.",
      "The universe conspires in my favour constantly.",
      "I receive what I want without guilt or apology.",
      "My life is a continuous stream of answered desires.",
      "I ask, believe, and receive. That's my pattern.",
      "My desires belong to me and they always arrive.",
    ],
  },
  {
    id: "bodymaxxing",
    name: "Bodymaxxing",
    bg: "#E0D0C0",
    hook: "Your body already knows how to be the version you want.",
    affirmations: [
      "My body is strong, sculpted, and magnetic.",
      "I move through the world with physical confidence.",
      "My body responds perfectly to everything I do.",
      "I am comfortable and proud in my own skin.",
      "Health and vitality are my natural default.",
      "My body is my most powerful asset.",
      "I look exactly the way I want to look.",
      "My physique turns heads. That's just a fact.",
    ],
  },
  {
    id: "skinnymaxxing",
    name: "Skinnymaxxing",
    bg: "#EAD8D0",
    hook: "Your body reflects the beliefs you hold about it.",
    affirmations: [
      "My metabolism is fast and effortless.",
      "I eat intuitively and my body responds beautifully.",
      "Staying slim is natural for me.",
      "My body releases what it no longer needs.",
      "I have the figure I've always wanted.",
      "My weight settles exactly where I want it.",
      "I am light, lean, and completely at home in my body.",
      "Looking exactly how I want is my natural state.",
    ],
  },
  {
    id: "wellnessmaxxing",
    name: "Wellnessmaxxing",
    bg: "#D8E0D8",
    hook: "Your body and mind were designed to be in perfect sync.",
    affirmations: [
      "I am in perfect health. My body knows this.",
      "Wellness is my natural baseline.",
      "Every cell in my body operates at peak function.",
      "I wake up feeling rested, clear, and energised.",
      "My immune system is powerful and protective.",
      "I choose habits that honour my health automatically.",
      "My body heals quickly and completely.",
      "I feel incredible in my body every single day.",
    ],
  },
  {
    id: "healmaxxing",
    name: "Healmaxxing",
    bg: "#D4E8E4",
    hook: "Healing isn't something you wait for. It's something you decide.",
    affirmations: [
      "I am healed, whole, and free from the past.",
      "My nervous system is safe and settled.",
      "I release what no longer belongs in my body.",
      "Healing comes easily and completely to me.",
      "I am no longer defined by what hurt me.",
      "My body, mind, and spirit are in full restoration.",
      "I give myself permission to feel completely well.",
      "The old version is gone. This version is healed.",
    ],
  },
  {
    id: "selfmaxxing",
    name: "Selfmaxxing",
    bg: "#D8C8E0",
    hook: "The upgraded version of you is already here.",
    affirmations: [
      "I know exactly who I am and I love her.",
      "My identity is unshakeable and deeply rooted.",
      "I choose myself first in every situation.",
      "I am whole without anyone else completing me.",
      "My sense of self is my strongest asset.",
      "I am the woman I always knew I could be.",
      "I trust myself completely in every decision.",
      "Being me is the most powerful thing I do.",
    ],
  },
  {
    id: "sovereignmaxxing",
    name: "Sovereignmaxxing",
    bg: "#D0B8B0",
    hook: "You answer to no one. You choose everything.",
    affirmations: [
      "My life is entirely on my own terms.",
      "I make rules for my own kingdom.",
      "I am untouchable in my own power.",
      "No one else's opinion shapes my reality.",
      "I move through the world as a free, sovereign woman.",
      "I answer to myself and my standards are high.",
      "My autonomy is sacred and I protect it.",
      "I am the authority on my own life.",
    ],
  },
  {
    id: "confidencemaxxing",
    name: "Confidencemaxxing",
    bg: "#D8B8B0",
    hook: "You walk in like you already own the room. Because you do.",
    affirmations: [
      "I am effortlessly confident in every situation.",
      "My presence commands attention naturally.",
      "I speak and people listen.",
      "I walk into rooms knowing I belong there.",
      "My confidence is quiet, unshakeable, and real.",
      "I am completely at ease being seen.",
      "Nothing rattles me. I know my worth.",
      "I carry myself like the woman I've always been becoming.",
    ],
  },
  {
    id: "lifemaxxing",
    name: "Lifemaxxing",
    bg: "#E0C8C0",
    hook: "Every area of your life is upgrading at exactly the same time.",
    affirmations: [
      "My life is expanding in every direction at once.",
      "Love, money, health, and joy arrive together.",
      "I have the life that used to feel impossible.",
      "Everything in my life is working at once.",
      "My reality is more beautiful than my dreams.",
      "I am living proof that it can all come together.",
      "My life is full, abundant, and deeply satisfying.",
      "This is the life I chose and I love it.",
    ],
  },
  {
    id: "singlemaxxing",
    name: "Singlemaxxing",
    bg: "#E4D4C4",
    hook: "Being single is not a waiting room. It's an identity.",
    affirmations: [
      "I am complete exactly as I am right now.",
      "My single life is rich, full, and entirely mine.",
      "I am not waiting for anyone to begin.",
      "I love myself in a way no one else needs to fill.",
      "Being alone is something I do powerfully.",
      "I am magnetic to the right person because I'm full.",
      "My standards are high and I don't negotiate them.",
      "I am someone worth waiting for. And I know it.",
    ],
  },
  {
    id: "friendmaxxing",
    name: "Friendmaxxing",
    bg: "#D8E8E0",
    hook: "Your circle actually deserves you now.",
    affirmations: [
      "I attract high-quality people effortlessly.",
      "My friendships are deep, loyal, and reciprocal.",
      "I am surrounded by people who celebrate me.",
      "The right people find me and stay.",
      "I give and receive friendship with ease.",
      "My social world reflects my level up.",
      "I am the friend people are lucky to have.",
      "I am always choosing people who choose me back.",
    ],
  },
  {
    id: "intuitionmaxxing",
    name: "Intuitionmaxxing",
    bg: "#D4C8E8",
    hook: "Your gut has never been wrong. You just stopped listening.",
    affirmations: [
      "My intuition is sharp, accurate, and always on.",
      "I trust my inner knowing completely.",
      "My gut always leads me in the right direction.",
      "I listen to myself before I listen to anyone else.",
      "My intuition is my greatest intelligence.",
      "Every instinct I follow pays off.",
      "I have access to deep inner wisdom at all times.",
      "My body tells me the truth and I always listen.",
    ],
  },
  {
    id: "studymaxxing",
    name: "Studymaxxing",
    bg: "#D8DCF0",
    hook: "Your mind absorbs everything it needs to know.",
    affirmations: [
      "I learn quickly and retain everything.",
      "My mind is sharp, focused, and expansive.",
      "I understand complex ideas with ease.",
      "My academic performance reflects my intelligence.",
      "I am disciplined, focused, and committed.",
      "Everything I study becomes a permanent part of me.",
      "My brain performs at its peak under pressure.",
      "I am becoming the expert I was always meant to be.",
    ],
  },
  {
    id: "peacemaxxing",
    name: "Peacemaxxing",
    bg: "#D8E4F0",
    hook: "Nothing rattles you. That's your permanent state.",
    affirmations: [
      "I am permanently, deeply at peace.",
      "Nothing can disturb my inner calm.",
      "I respond to life from stillness, not panic.",
      "My nervous system is regulated and at ease.",
      "Peace is the ground I stand on.",
      "I release anxiety and return to calm effortlessly.",
      "My default mode is peace and clarity.",
      "I carry stillness everywhere I go.",
    ],
  },
  {
    id: "sleepmaxxing",
    name: "Sleepmaxxing",
    bg: "#C8CCE8",
    hook: "You manifest while you sleep. That's just how it works.",
    affirmations: [
      "I fall asleep easily and sleep deeply every night.",
      "My sleep is restorative, deep, and healing.",
      "I wake up feeling completely restored.",
      "My subconscious works for me while I sleep.",
      "I manifest my desires in my sleep effortlessly.",
      "Rest comes easily and naturally to me.",
      "Every night I drift into perfect, peaceful sleep.",
      "I wake up energised and ready for what's mine.",
    ],
  },
  {
    id: "dnamaxxing",
    name: "DNAmaxxing",
    bg: "#CCE4E8",
    hook: "Your cells hold your new identity. It's already done.",
    affirmations: [
      "My DNA is activating my highest potential.",
      "I am upgrading at a cellular level right now.",
      "My genes express health, beauty, and vitality.",
      "I am built for longevity and radiance.",
      "My body knows how to regenerate and renew.",
      "I am encoded for abundance in every form.",
      "My blueprint is extraordinary and it's unfolding.",
      "Every cell in my body carries my new identity.",
    ],
  },
  {
    id: "luckygirlmaxxing",
    name: "Luckygirlmaxxing",
    bg: "linear-gradient(135deg, #F0D8C0, #E0A8A0)",
    hook: "Everything works out for you. It always has. It always will.",
    affirmations: [
      "I am the luckiest girl I know.",
      "Good things happen to me constantly.",
      "I am always in the right place at the right time.",
      "Life conspires in my favour without effort.",
      "Miracles are just my normal.",
      "Things always work out better than expected for me.",
      "I attract luck, favour, and divine coincidence.",
      "I expect good things. And they always come.",
    ],
  },
];

// ── Inline Carousel component (no iframe needed) ────────────────────────────
function SlideCarousel({ category, isMobile }) {
  const [cur, setCur] = useState(0);
  const startX = useRef(null);
  const slides = [
    { type: "hook",   text: category.hook },
    ...category.affirmations.map(a => ({ type: "affirmation", text: a })),
    { type: "cta",    text: null },
  ];
  const N = slides.length;

  const goTo = useCallback((i) => setCur(Math.max(0, Math.min(N - 1, i))), [N]);
  const move = (dir) => goTo(cur + dir);

  const onTouchStart = (e) => { startX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (startX.current === null) return;
    const dx = e.changedTouches[0].clientX - startX.current;
    if (Math.abs(dx) > 40) move(dx < 0 ? 1 : -1);
    startX.current = null;
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") move(1);
      if (e.key === "ArrowLeft") move(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cur]);

  const W = isMobile ? Math.min(window.innerWidth - 48, 320) : 320;
  const H = Math.round(W * (560 / 420));

  const slideBg = category.bg;
  const isGradient = slideBg.startsWith("linear");

  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:0 }}>
      {/* Frame */}
      <div style={{ width:W, background:"#06040c", borderRadius:14, overflow:"hidden", boxShadow:"0 0 0 1px #1c1828" }}>
        {/* Viewport */}
        <div
          style={{ width:W, height:H, overflow:"hidden", position:"relative", userSelect:"none", cursor:"grab" }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* Track */}
          <div style={{ display:"flex", height:H, transition:"transform .28s cubic-bezier(.4,0,.2,1)", transform:`translateX(${-cur * W}px)`, willChange:"transform" }}>
            {slides.map((slide, i) => {
              const isCta = slide.type === "cta";
              const bg = isCta ? "#06040c" : slideBg;
              const textCol = isCta ? "#f2ece4" : "#000";
              return (
                <div
                  key={i}
                  style={{
                    width: W, height: H, flexShrink: 0,
                    background: bg,
                    display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center",
                    padding: `${Math.round(H*0.09)}px ${Math.round(W*0.09)}px ${Math.round(H*0.13)}px`,
                    textAlign: "center", position: "relative", overflow: "hidden",
                  }}
                >
                  {/* Slide number */}
                  <div style={{ position:"absolute", top:Math.round(H*0.028), right:Math.round(W*0.038), fontSize:10, fontWeight:500, fontFamily:"'Jost',sans-serif", letterSpacing:"0.05em", color: isCta ? "rgba(242,236,228,0.3)" : "rgba(0,0,0,0.3)" }}>
                    {String(i+1).padStart(2,"0")}
                  </div>

                  {isCta ? (
                    <>
                      <p style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontStyle:"italic", fontSize:Math.round(W*0.073), fontWeight:500, lineHeight:1.3, color:"#f2ece4", marginBottom:14 }}>
                        Save this.<br/>Listen tonight.
                      </p>
                      <p style={{ fontFamily:"'Jost',sans-serif", fontSize:Math.round(W*0.033), fontWeight:400, color:"rgba(242,236,228,0.5)", letterSpacing:"0.1em", textTransform:"lowercase" }}>
                        reshmaoracle.com
                      </p>
                    </>
                  ) : (
                    <p style={{
                      fontFamily: slide.type === "hook" ? "'Cormorant Garamond',Georgia,serif" : "'Jost',sans-serif",
                      fontStyle: slide.type === "hook" ? "italic" : "normal",
                      fontSize: slide.type === "hook" ? Math.round(W*0.067) : Math.round(W*0.055),
                      fontWeight: slide.type === "hook" ? 500 : 600,
                      lineHeight: slide.type === "hook" ? 1.25 : 1.3,
                      color: textCol,
                      letterSpacing: slide.type === "hook" ? "0.01em" : "0.02em",
                    }}>
                      {slide.text}
                    </p>
                  )}

                  {/* Brand mark */}
                  <div style={{ position:"absolute", bottom:Math.round(H*0.022), right:Math.round(W*0.038), fontFamily:"'Jost',sans-serif", fontSize:Math.round(W*0.024), fontWeight:500, letterSpacing:"0.15em", color: isCta ? "rgba(242,236,228,0.2)" : "rgba(0,0,0,0.25)" }}>
                    SHG
                  </div>
                </div>
              );
            })}
          </div>

          {/* Arrows */}
          {cur > 0 && (
            <button onClick={() => move(-1)} style={{ position:"absolute", left:8, top:"50%", transform:"translateY(-50%)", width:28, height:28, borderRadius:"50%", border:"none", background:"rgba(0,0,0,0.15)", color:"#000", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, zIndex:10 }}>‹</button>
          )}
          {cur < N-1 && (
            <button onClick={() => move(1)} style={{ position:"absolute", right:8, top:"50%", transform:"translateY(-50%)", width:28, height:28, borderRadius:"50%", border:"none", background:"rgba(0,0,0,0.15)", color:"#000", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, zIndex:10 }}>›</button>
          )}
        </div>

        {/* Dots */}
        <div style={{ display:"flex", gap:4, justifyContent:"center", alignItems:"center", padding:"8px 0", background:"#000" }}>
          {slides.map((_, i) => (
            <div key={i} onClick={() => goTo(i)} style={{ width: i===cur?8:5, height: i===cur?8:5, borderRadius:"50%", background: i===cur?"#d4a090":"#786860", cursor:"pointer", transition:"all .2s" }}/>
          ))}
        </div>

        {/* Thumbnail strip */}
        <div style={{ background:"#000", padding:"8px 10px", display:"flex", gap:5, overflowX:"auto", borderTop:"1px solid #1c1828", scrollbarWidth:"none" }}>
          {slides.map((slide, i) => {
            const isCta = slide.type === "cta";
            const thumbBg = isCta ? "#06040c" : slideBg;
            const S = 42 / W;
            return (
              <div
                key={i}
                onClick={() => goTo(i)}
                style={{ width:42, height:Math.round(H*S), flexShrink:0, borderRadius:3, overflow:"hidden", cursor:"pointer", border: i===cur?"1.5px solid #d4a090":"1.5px solid transparent", opacity: i===cur?1:0.45, transition:"all .2s" }}
              >
                <div style={{ width:W, height:H, background:thumbBg, transform:`scale(${S})`, transformOrigin:"top left", pointerEvents:"none", display:"flex", alignItems:"center", justifyContent:"center", padding:`${Math.round(H*0.09)}px ${Math.round(W*0.09)}px` }}>
                  <span style={{ fontFamily: slide.type==="hook"?"'Cormorant Garamond',serif":"'Jost',sans-serif", fontStyle: slide.type==="hook"?"italic":"normal", fontSize: Math.round(W*0.055), fontWeight: slide.type==="hook"?500:600, color: isCta?"#f2ece4":"#000", lineHeight:1.2, textAlign:"center" }}>
                    {isCta ? "CTA" : slide.text.slice(0,18)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <p style={{ fontSize:11, color:"#786860", fontFamily:"'Jost',sans-serif", marginTop:10, letterSpacing:"0.04em" }}>
        ← → arrow keys · swipe · click thumbnails
      </p>
    </div>
  );
}

// ── Category grid card ───────────────────────────────────────────────────────
function CategoryCard({ cat, onClick, isMobile }) {
  const isGradient = cat.bg.startsWith("linear");
  return (
    <button
      onClick={() => onClick(cat)}
      style={{
        background: "#06040c", border: "1px solid #1c1828", borderRadius: 14,
        padding: "0", cursor: "pointer", textAlign: "left", overflow: "hidden",
        transition: "border-color .2s, transform .15s", fontFamily: "'Jost',sans-serif",
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "#786860"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "#1c1828"; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      {/* Color swatch */}
      <div style={{ width: "100%", height: 56, background: cat.bg }} />
      {/* Label */}
      <div style={{ padding: "12px 14px 14px" }}>
        <div style={{ fontSize: isMobile?11:12, fontWeight: 600, color: "#f2ece4", marginBottom: 4, letterSpacing:"0.01em" }}>
          {cat.name}
        </div>
        <div style={{ fontSize: isMobile?10:11, color: "#786860", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {cat.hook}
        </div>
      </div>
    </button>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function CarouselStudio() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 680);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 680);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const filtered = CATEGORIES.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#f2ece4", fontFamily: "'Jost',sans-serif" }}>
      {/* Header */}
      <div style={{ padding: isMobile ? "20px 20px 0" : "28px 40px 0", display: "flex", alignItems: "center", gap: 16 }}>
        <button
          onClick={() => navigate(-1)}
          style={{ background: "none", border: "none", color: "#786860", cursor: "pointer", fontSize: 20, padding: 4, lineHeight: 1 }}
        >
          ←
        </button>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "#786860", marginBottom: 2 }}>SHG</div>
          <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 300, letterSpacing: "-0.01em" }}>Carousel Studio</div>
        </div>
      </div>

      {/* Sub-header */}
      <div style={{ padding: isMobile ? "12px 20px 0" : "16px 40px 0" }}>
        <p style={{ fontSize: isMobile ? 13 : 14, color: "#786860", lineHeight: 1.6, maxWidth: 540 }}>
          24 categories · 10 slides each · swipe to preview, export at 1080×1440.
        </p>
      </div>

      {/* Search */}
      <div style={{ padding: isMobile ? "16px 20px" : "20px 40px" }}>
        <input
          type="text"
          placeholder="Search categories…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: "100%", maxWidth: 400, background: "#06040c", border: "1px solid #1c1828",
            borderRadius: 10, padding: "11px 16px", color: "#f2ece4", fontSize: 14,
            fontFamily: "'Jost',sans-serif", outline: "none", boxSizing: "border-box",
          }}
        />
      </div>

      {/* Category grid + preview panel */}
      <div style={{
        display: "grid",
        gridTemplateColumns: selected ? (isMobile ? "1fr" : "1fr 380px") : "1fr",
        gap: 0,
        minHeight: "calc(100vh - 160px)",
        alignItems: "start",
      }}>
        {/* Grid */}
        <div style={{ padding: isMobile ? "0 20px 60px" : "0 40px 60px" }}>
          {selected && isMobile && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "#786860", marginBottom: 2 }}>{selected.name}</div>
                  <div style={{ fontSize: 13, color: "#b09888", fontStyle: "italic" }}>{selected.hook}</div>
                </div>
                <button onClick={() => setSelected(null)} style={{ background: "none", border: "1px solid #1c1828", borderRadius: 8, color: "#786860", cursor: "pointer", fontSize: 12, padding: "6px 12px", fontFamily: "'Jost',sans-serif" }}>Close</button>
              </div>
              <SlideCarousel category={selected} isMobile={isMobile} />
              <div style={{ marginTop: 20, borderBottom: "1px solid #1c1828", paddingBottom: 24 }} />
            </div>
          )}
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(auto-fill, minmax(200px, 1fr))",
            gap: isMobile ? 10 : 14,
          }}>
            {filtered.map(cat => (
              <CategoryCard
                key={cat.id}
                cat={cat}
                onClick={(c) => setSelected(sel => sel?.id === c.id ? null : c)}
                isMobile={isMobile}
              />
            ))}
            {filtered.length === 0 && (
              <div style={{ gridColumn: "1/-1", padding: "40px 0", textAlign: "center", color: "#786860", fontSize: 14 }}>
                No categories match "{search}"
              </div>
            )}
          </div>
        </div>

        {/* Preview panel — desktop only */}
        {selected && !isMobile && (
          <div style={{ position: "sticky", top: 0, padding: "0 40px 60px 20px", paddingTop: 20 }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "#786860", marginBottom: 4 }}>{selected.name}</div>
                <div style={{ fontSize: 13, color: "#b09888", fontStyle: "italic", maxWidth: 280, lineHeight: 1.5 }}>{selected.hook}</div>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: "none", border: "1px solid #1c1828", borderRadius: 8, color: "#786860", cursor: "pointer", fontSize: 12, padding: "6px 12px", fontFamily: "'Jost',sans-serif", flexShrink: 0, marginLeft: 12 }}>✕</button>
            </div>

            <SlideCarousel category={selected} isMobile={false} />

            {/* Export hint */}
            <div style={{ marginTop: 20, padding: "14px 16px", background: "#06040c", borderRadius: 10, border: "1px solid #1c1828" }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#786860", marginBottom: 8 }}>Export at 1080×1440</div>
              <code style={{ fontSize: 11, color: "#d4a090", display: "block", lineHeight: 1.7 }}>
                node export-slides.js \<br/>
                &nbsp;&nbsp;carousels/{selected.id}/index.html
              </code>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
