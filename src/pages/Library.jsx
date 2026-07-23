/* Library — The 24 Categories */
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import HamburgerMenu from "../components/HamburgerMenu.jsx";

const LG = "linear-gradient(135deg,#F5E0A0 0%,#E8B870 20%,#BFA5D8 52%,#2CB7A7 78%,#167A6B 100%)";
const BLACK = "#000000";
const CREAM = "#fdf0e8";
const MU = "#a09080";
const TEAL = "#2CB7A7";

const CATEGORIES = [
  {
    name: "Lovemaxxing",
    accent: "#F5E0A0",
    tagline: "The relationship you want already exists. Your belief system is the only thing between you and it.",
    pain: "You keep choosing the same dynamic. You wonder why they pull away. You analyse every text. You give too much and still feel like it's not enough. You've been told you're too much — or not enough — for so long you're starting to believe it.",
    what: "Lovemaxxing tracks reprogram the belief underneath the pattern. Not how you act in relationships — who you believe you are in them. When that shifts, everything shifts. You stop chasing. You stop shrinking. You stop accepting what doesn't match what you actually want.",
    shift: "From chasing, proving, wondering where you stand — to feeling like the love you want is already yours."
  },
  {
    name: "Singlemaxxing",
    accent: "#F5E0A0",
    tagline: "Being single is not a waiting room. It's an identity. Make it one worth inhabiting.",
    pain: "You feel the pressure — from everyone, from yourself. You're either rushing toward something or feeling like you're falling behind. The version of you that's thriving alone feels like a performance. The version that's honest about wanting more feels like a wound.",
    what: "Singlemaxxing installs the frequency of someone who is complete right now. Not someone pretending to be fine. Someone who is actually fine — and from that place, magnetic. The tracks work on the belief that you need someone else to complete the picture.",
    shift: "From waiting to begin — to feeling like your life is already full."
  },
  {
    name: "Moneymaxxing",
    accent: "#E8B870",
    tagline: "Money doesn't go to the most deserving. It goes to the most believing.",
    pain: "You work hard. You do everything right. And the money still feels like it's always just slightly out of reach — or it arrives and disappears. You feel guilty spending. You feel anxious not spending. You equate money with stress, with struggle, with things that aren't meant for you.",
    what: "Moneymaxxing targets the subconscious identity underneath your bank balance. The one that was installed before you were old enough to question it. Every track runs subliminals that say you are the kind of person money moves toward — not as a treat, as a default.",
    shift: "From feeling like money is something you fight for — to feeling like it's already looking for you."
  },
  {
    name: "Businessmaxxing",
    accent: "#2CB7A7",
    tagline: "Your business grows at the speed of your belief in it.",
    pain: "You second-guess every decision. You undercharge because you're not sure you're worth it yet. You watch people with less skill getting more results and you can't work out why. You're exhausted from pushing and not seeing it move.",
    what: "Businessmaxxing works on the CEO identity — the version of you that makes decisions from certainty, not anxiety. The tracks install the belief that your work finds its people, that your pricing reflects your value, that you don't have to force what's already coming.",
    shift: "From forcing growth — to feeling like your business is already finding the people it's meant for."
  },
  {
    name: "Beautymaxxing",
    accent: "#F5E0A0",
    tagline: "The mirror doesn't show you what others see. It shows you what you believe.",
    pain: "You pick yourself apart. You zoom in on every flaw. You know rationally that you're being harsh — and still you can't stop. You've spent money on products, procedures, routines — and the mirror still feels hostile. The gap between how you look and how you feel you should look seems permanent.",
    what: "Beautymaxxing doesn't tell you you're beautiful. It installs the felt sense of it — the way it lives in the body, not just the thoughts. The tracks run while you sleep, while you rest, shifting the subconscious belief underneath the scrutiny.",
    shift: "From picking yourself apart — to actually seeing what other people already see."
  },
  {
    name: "Facemaxxing",
    accent: "#E8B870",
    tagline: "Your face isn't the problem. Your relationship with it is.",
    pain: "You avoid photos. You don't like catching your reflection unexpectedly. You've edited yourself in pictures until you barely recognise the result. The anxiety about how you look takes up more mental space than you want to admit.",
    what: "Facemaxxing installs ease in your own features. Not performed confidence — the quiet version. The one that doesn't need to check. The tracks target the scrutiny loop at the subconscious level, where it actually runs.",
    shift: "From scrutinising every angle — to feeling settled in how you actually look."
  },
  {
    name: "Bodymaxxing",
    accent: "#2CB7A7",
    tagline: "You can't hate yourself into a body you love.",
    pain: "You've been at war with your body for years. You know all the rules. You've tried everything. The frustration isn't about discipline — it's about the relationship. Your body feels like something that betrays you, disappoints you, needs to be controlled.",
    what: "Bodymaxxing works on the body relationship, not the body. When the subconscious stops treating the body as an enemy, everything changes — cravings, movement, how you actually feel in your skin. The tracks run the new identity while the body rests.",
    shift: "From fighting your body — to feeling like it's finally on your side."
  },
  {
    name: "Skinnymaxxing",
    accent: "#2CB7A7",
    tagline: "Restriction is not a belief system. Install a new one.",
    pain: "You think about food constantly. You cycle through phases of control and giving up. The number on the scale has too much power over how the day feels. You've done the diets. You know what to do. The problem isn't knowledge — it's what's running underneath it.",
    what: "Skinnymaxxing targets the subconscious identity around food, body, and control — replacing restriction with a felt sense of ease. The belief that your body already knows what it's doing. The tracks install this while the critical mind is offline.",
    shift: "From fighting yourself through restriction — to feeling like your body already knows what it's doing."
  },
  {
    name: "DNAmaxxing",
    accent: "#167A6B",
    tagline: "Your genetics are not your destiny. Your beliefs run deeper than your DNA.",
    pain: "You've inherited things you didn't ask for — patterns, conditions, fears about what's coming. You feel like your biology is something happening to you, not something you have any relationship with.",
    what: "DNAmaxxing works at the deepest level — the belief that your body is listening. That the cells respond to the instruction you give them. Science calls it epigenetics. These tracks give your subconscious the instruction at the frequency level.",
    shift: "From feeling like ageing and genetics are happening to you — to feeling like your body is responding to what you tell it."
  },
  {
    name: "Selfmaxxing",
    accent: "#BFA5D8",
    tagline: "The version of you that you're becoming is already real. Get her frequency.",
    pain: "You know what you want to be like. You can see her clearly. And then real life happens and you revert — to the old reactions, the old smallness, the old voice in your head. The gap between who you are and who you're becoming feels exhausting.",
    what: "Selfmaxxing is identity-level rewiring. The tracks install the felt sense of the version of you that you're becoming — not through visualisation, through embodiment. The subconscious takes the instruction and starts running the new program.",
    shift: "From shrinking to fit — to taking up the space you were always allowed to take."
  },
  {
    name: "Erosmaxxing",
    accent: "#F5E0A0",
    tagline: "Confidence in your body. Ease in your desire. You're allowed to want what you want.",
    pain: "You perform confidence in certain rooms and feel yourself collapse in others. Intimacy is where the old stories get the loudest — about whether you're enough, whether your desire is too much, whether you're doing it right. You've disconnected from parts of yourself without realising it.",
    what: "Erosmaxxing installs ease in the body, permission in desire, and the identity of someone who is settled in their own magnetism. The tracks work on the layers underneath the performance.",
    shift: "From performing confidence — to actually feeling it, in the moments that used to make you shrink."
  },
  {
    name: "Sleepmaxxing",
    accent: "#2CB7A7",
    tagline: "You don't have to be awake for it to work. Your subconscious never sleeps.",
    pain: "You want to do the work but life is full. By the time you get to bed, you're too tired for rituals. You fall asleep mid-affirmation. You wonder if you're doing enough, if you're consistent enough, if you're ever going to see it move.",
    what: "Sleepmaxxing is designed for the moment between waking and sleep — when the critical mind goes offline and the subconscious is completely open. You press play, you drift off, and the installation continues without you. This is the most powerful window of the day. These tracks are built for it.",
    shift: "From feeling like manifestation requires constant conscious effort — to feeling like your reality rebuilds itself while you rest."
  },
  {
    name: "Studymaxxing",
    accent: "#BFA5D8",
    tagline: "Your mind is not the problem. Your belief about your mind is.",
    pain: "You blank in exams. You can't retain what you read. You compare yourself to people who seem to absorb everything effortlessly and wonder what's wrong with you. The anxiety about performance kills the performance.",
    what: "Studymaxxing installs the belief in your own mind's capability. The tracks run subliminals targeting retention, focus, and the identity of someone who finds this easy — because ease is a frequency before it's a result.",
    shift: "From feeling like you have to grind to keep up — to feeling like the information already makes sense to you."
  },
  {
    name: "Friendmaxxing",
    accent: "#2CB7A7",
    tagline: "You attract the circle you believe you deserve.",
    pain: "You feel lonely in groups of people. You have a lot of acquaintances and not enough people who actually see you. You're the one who always reaches out. You've started wondering if deep friendship just isn't something that happens for you anymore.",
    what: "Friendmaxxing works on the subconscious belief about your own magnetism in relationships — not romantic, just human. The belief that you are worth reaching out to, worth staying for, worth building something real with.",
    shift: "From settling for a circle that drains you — to attracting people who actually see you."
  },
  {
    name: "Peacemaxxing",
    accent: "#2CB7A7",
    tagline: "Peace is not the absence of chaos. It's the frequency underneath it.",
    pain: "You're always waiting for the next thing to go wrong. You can't enjoy the good because you're bracing for it to end. Your nervous system has been in threat mode for so long that stillness feels suspicious. You don't know what it feels like to just be okay.",
    what: "Peacemaxxing installs the nervous system frequency of someone who is fundamentally okay — regardless of what's happening around them. The tracks run EMDR bilateral audio to process the threat state, combined with subliminals that install the new baseline.",
    shift: "From being on edge waiting for things to go wrong — to feeling steady no matter what's happening."
  },
  {
    name: "Confidencemaxxing",
    accent: "#E8B870",
    tagline: "Confidence is not something you find. It's something you install.",
    pain: "You wait until you feel ready and ready never comes. You overthink what you said after every social interaction. You rehearse conversations. You shrink in rooms where you think you're being judged. You know you're capable — you just can't make yourself feel it when it matters.",
    what: "Confidencemaxxing installs the identity of someone who walks in without rehearsing. Not arrogance — settled. The tracks work on the subconscious belief that you are enough before you've proven it, which is the only place confidence can actually come from.",
    shift: "From waiting to feel ready — to walking into rooms like you already belong there."
  },
  {
    name: "Stylemaxxing",
    accent: "#BFA5D8",
    tagline: "Style is not fashion. It's the visible frequency of your identity.",
    pain: "You stand in front of your wardrobe and feel nothing. Or you feel like you're wearing a costume. You buy things that look right on the hanger and wrong on you. You know what you want to look like and you can't bridge the gap between that image and what you actually put on.",
    what: "Stylemaxxing installs the identity of the woman whose outside matches her inside. The tracks don't teach you about fashion — they install the felt sense of someone who already knows exactly who she is, which naturally shows up in how she dresses.",
    shift: "From dressing to hide — to dressing like the woman you're already becoming."
  },
  {
    name: "Healmaxxing",
    accent: "#F5E0A0",
    tagline: "You don't have to keep carrying what happened to you as proof of who you are.",
    pain: "Something happened and you've been rebuilding around it ever since. You've done the therapy, the journalling, the processing. And still there are moments where it comes back. Where you react in ways you don't want to react. Where the old pain is still somewhere in the body.",
    what: "Healmaxxing uses EMDR bilateral audio and theta-state access to process what talk therapy can't always reach — the stored frequency in the nervous system. The tracks work while you rest, gently shifting what's held in the body.",
    shift: "From carrying old pain as part of your identity — to feeling like the version of you that's already moved through it."
  },
  {
    name: "Wellnessmaxxing",
    accent: "#2CB7A7",
    tagline: "Your body runs on the frequency you give it.",
    pain: "You're tired in a way sleep doesn't fix. You're doing all the right things and still running on empty. You've normalised feeling like this. You've forgotten what it felt like to actually feel good.",
    what: "Wellnessmaxxing installs the body's belief in its own vitality. Not motivation — deeper. The subconscious instruction that your body and mind are working together, that restoration is available, that this is the baseline you're returning to.",
    shift: "From running on empty and calling it normal — to feeling like your body and mind are finally working together."
  },
  {
    name: "Luckygirlmaxxing",
    accent: "#2CB7A7",
    tagline: "Luck is a frequency. Some people are tuned to it by default. You can install it.",
    pain: "Things work out for other people. You work hard, you plan, you do everything right — and still there's always a catch. You've stopped expecting things to just go your way because they usually don't. The belief that life is a struggle has become so background you've stopped noticing it.",
    what: "Luckygirlmaxxing installs the frequency of expectation — the deep subconscious assumption that things work out, that doors open, that you are someone good things happen to. This is not manifestation positivity. This is a belief system installed at the theta level.",
    shift: "From feeling like good things happen to other people — to expecting things to work out for you by default."
  },
  {
    name: "Sovereignmaxxing",
    accent: "#BFA5D8",
    tagline: "You were never waiting for permission. Install the belief that makes that true.",
    pain: "You edit yourself before you speak. You need someone else to validate your decision before you trust it. You give your power away in rooms where you feel judged and don't know how to take it back. The version of you that answers to no one feels like fiction.",
    what: "Sovereignmaxxing installs the identity of someone who trusts themselves as the final authority. Not independence as rigidity — as groundedness. The tracks target the subconscious need for external approval, replacing it with internal certainty.",
    shift: "From seeking approval before you act — to trusting your own judgement as enough."
  },
  {
    name: "Lifemaxxing",
    accent: "#E8B870",
    tagline: "The life you're waiting for is already available. Install the belief that lets you live it.",
    pain: "You feel like your real life starts when — when you lose the weight, meet the person, get the job, move somewhere new. You're holding your breath. You're living like a rehearsal. You've been waiting so long you've started to forget what you're waiting for.",
    what: "Lifemaxxing installs the frequency of someone who is already living it. Not the fantasy version — the felt sense of presence, aliveness, enough-ness in the actual moment. The tracks shift the subconscious from future-orientation to embodied now.",
    shift: "From waiting for your life to start — to feeling like you're already living the version you used to dream about."
  },
  {
    name: "Intuitionmaxxing",
    accent: "#BFA5D8",
    tagline: "You already know. Install the belief that lets you trust it.",
    pain: "You talk yourself out of what you already know. You take the logical option and regret it. You ask everyone else what they think before you act on what you feel. You've overridden your gut so many times you've stopped being able to hear it.",
    what: "Intuitionmaxxing installs the felt sense of trusting your first instinct. The tracks work on the subconscious layers that learned to override inner knowing — installing the belief that your perception is accurate, your read on situations is valid, your instincts are worth following.",
    shift: "From talking yourself out of what you already know — to trusting your first instinct."
  },
  {
    name: "Desiresmaxxing",
    accent: "#F5E0A0",
    tagline: "Your desires are not too much. They are the pull. Follow it.",
    pain: "You feel guilty for wanting what you want. You've been told you're greedy, unrealistic, too much. You've learned to moderate your desires before you even let yourself feel them fully. You want things you don't let yourself want.",
    what: "Desiresmaxxing installs the identity of someone whose desires are valid, specific, and already in motion toward her. Not someone who chases — someone who is chased back. The tracks work on the guilt and the belief of unworthiness underneath it.",
    shift: "From chasing your desires — to feeling like they are already chasing you back."
  },
];

export default function Library({ onBack }) {
  const navigate = useNavigate();
  const topRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [active, setActive] = useState(null);

  useEffect(() => {
    if (topRef.current) topRef.current.scrollIntoView({ behavior:"instant" });
    document.documentElement.scrollTop = 0;
    window.scrollTo(0, 0);
    const h = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);

  return (
    <div ref={topRef} style={{ minHeight:"100vh", background:BLACK, color:CREAM, fontFamily:"'Jost',sans-serif" }}>

      {/* NAV */}
      <div style={{ position:"sticky", top:0, zIndex:50, background:"rgba(0,0,0,0.94)", backdropFilter:"blur(12px)", borderBottom:"1px solid rgba(255,255,255,0.06)", padding:"0 24px", height:52, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <button onClick={onBack} style={{ background:"none", border:"none", color:MU, fontSize:13, cursor:"pointer", display:"flex", alignItems:"center", gap:6, fontFamily:"'Jost',sans-serif", letterSpacing:"0.04em" }}>← Back</button>
        <span style={{ fontSize:12, color:MU, letterSpacing:"0.18em", textTransform:"uppercase" }}>The Library · reshmaoracle.com</span>
        <HamburgerMenu/>
      </div>

      {/* HERO */}
      <div style={{ background:LG, padding: isMobile?"64px 24px 56px":"88px 24px 72px", textAlign:"center" }}>
        <div style={{ display:"flex", justifyContent:"center", marginBottom:24 }}>
          <svg viewBox="0 0 100 102" width={isMobile?56:72} height={isMobile?56:72} fill="none">
            <defs><linearGradient id="liblg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#000"/><stop offset="100%" stopColor="#000"/></linearGradient></defs>
            <circle cx="35" cy="35" r="18" fill="none" stroke="#000" strokeWidth="2"/>
            <circle cx="65" cy="35" r="18" fill="none" stroke="#000" strokeWidth="2"/>
            <circle cx="35" cy="65" r="18" fill="none" stroke="#000" strokeWidth="2"/>
            <circle cx="65" cy="65" r="18" fill="none" stroke="#000" strokeWidth="2"/>
            
          </svg>
        </div>
        <div style={{ fontSize:12, letterSpacing:"0.22em", textTransform:"uppercase", color:"rgba(0,0,0,0.5)", marginBottom:16, fontFamily:"'Jost',sans-serif" }}>Self Hypnosis Goddess</div>
        <h1 style={{ fontFamily:"'Jost',sans-serif", fontSize: isMobile?"clamp(32px,9vw,48px)":"clamp(40px,5vw,64px)", color:BLACK, margin:"0 0 20px", lineHeight:1.1, fontWeight:400 }}>
          The 24 categories.
        </h1>
        <p style={{ fontSize: isMobile?16:18, color:"rgba(0,0,0,0.6)", maxWidth:560, margin:"0 auto", lineHeight:1.7 }}>
          Every area of your life where your belief system is running the wrong program. Every category is a full audio library targeting the identity underneath the result.
        </p>
      </div>

      {/* INTRO */}
      <div style={{ background:BLACK, padding: isMobile?"48px 20px":"64px 24px", textAlign:"center" }}>
        <div style={{ maxWidth:660, margin:"0 auto" }}>
          <p style={{ fontSize: isMobile?16:18, color:"#fdf0e8", lineHeight:1.85, marginBottom:20 }}>
            You don't have to use all of them. You use the one that matches where your gap is right now. The desire you keep circling back to. The thing that feels just slightly out of reach no matter what you do.
          </p>
          <p style={{ fontSize: isMobile?16:18, color:"#fdf0e8", lineHeight:1.85 }}>
            Find your category. Press play. Let the theta state do what your conscious mind has been trying to do for years.
          </p>
        </div>
      </div>

      {/* CATEGORIES GRID */}
      <div style={{ background:"#080808", padding: isMobile?"32px 16px 80px":"48px 32px 96px" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ display:"grid", gridTemplateColumns: isMobile?"1fr": "1fr 1fr", gap:16 }}>
            {CATEGORIES.map((cat, i) => (
              <div key={i}
                onClick={() => setActive(active === i ? null : i)}
                style={{ background: active===i ? (i%3===1?"#e8e0d6":i%3===2?"linear-gradient(135deg,#F5E0A0 0%,#E8B870 20%,#BFA5D8 52%,#2CB7A7 78%,#167A6B 100%)":"rgba(255,255,255,0.06)") : (i%3===0?"#111":i%3===1?"#fdf0e8":"linear-gradient(135deg,#F5E0A0 0%,#E8B870 20%,#BFA5D8 52%,#2CB7A7 78%,#167A6B 100%)"), border:`1px solid ${active===i ? cat.accent : (i%3===0?"rgba(255,255,255,0.1)":i%3===1?"rgba(0,0,0,0.12)":"rgba(0,0,0,0.15)")}`, borderRadius:20, overflow:"hidden", cursor:"pointer", transition:"border-color 0.2s, background 0.2s" }}>

                {/* Card header */}
                <div style={{ padding: isMobile?"20px 20px 16px":"24px 28px 20px" }}>
                  <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:12 }}>
                    <div>
                      <div style={{ fontSize: isMobile?11:11, letterSpacing:"0.2em", textTransform:"uppercase", color: i%3===1||i%3===2 ? "rgba(0,0,0,0.5)" : cat.accent, marginBottom:8, fontFamily:"'Jost',sans-serif", fontWeight:500 }}>Category {String(i+1).padStart(2,"0")}</div>
                      <h2 style={{ fontSize: isMobile?22:26, fontWeight:400, color: i%3===1||i%3===2 ? "#0a0a0a" : CREAM, fontFamily:"'Jost',sans-serif", margin:0, lineHeight:1.1 }}>{cat.name}</h2>
                    </div>
                    <div style={{ width:32, height:32, borderRadius:"50%", border:`1px solid ${i%3===1?cat.accent+"80":cat.accent+"40"}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:4, transition:"transform 0.2s", transform: active===i?"rotate(45deg)":"none" }}>
                      <span style={{ color:cat.accent, fontSize:18, lineHeight:1 }}>+</span>
                    </div>
                  </div>
                  <p style={{ fontSize: isMobile?14:15, color: i%3===1||i%3===2 ? "rgba(0,0,0,0.6)" : "rgba(253,240,232,0.65)", lineHeight:1.6, fontFamily:"'Jost',sans-serif", margin:0, fontStyle:"italic" }}>"{cat.tagline}"</p>
                </div>

                {/* Expanded content */}
                {active === i && (
                  <div style={{ borderTop:`1px solid rgba(255,255,255,0.06)` }}>
                    {/* Pain */}
                    <div style={{ padding: isMobile?"20px 20px":"24px 28px", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                      <div style={{ fontSize:10, letterSpacing:"0.2em", textTransform:"uppercase", color: i%3===1||i%3===2 ? "#8a7060" : MU, marginBottom:12, fontFamily:"'Jost',sans-serif" }}>The pain point</div>
                      <p style={{ fontSize: isMobile?14:15, color: i%3===1 ? "rgba(0,0,0,0.7)" : "#fdf0e8", lineHeight:1.75, fontFamily:"'Jost',sans-serif", margin:0 }}>{cat.pain}</p>
                    </div>
                    {/* What it does */}
                    <div style={{ padding: isMobile?"20px 20px":"24px 28px", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                      <div style={{ fontSize:10, letterSpacing:"0.2em", textTransform:"uppercase", color: i%3===1||i%3===2 ? "#8a7060" : MU, marginBottom:12, fontFamily:"'Jost',sans-serif" }}>What the audio does</div>
                      <p style={{ fontSize: isMobile?14:15, color: i%3===1 ? "rgba(0,0,0,0.7)" : "#fdf0e8", lineHeight:1.75, fontFamily:"'Jost',sans-serif", margin:0 }}>{cat.what}</p>
                    </div>
                    {/* The shift */}
                    <div style={{ padding: isMobile?"20px 20px":"24px 28px", background:`linear-gradient(135deg,${cat.accent}12 0%,transparent 100%)` }}>
                      <div style={{ fontSize:10, letterSpacing:"0.2em", textTransform:"uppercase", color:cat.accent, marginBottom:12, fontFamily:"'Jost',sans-serif" }}>The shift</div>
                      <p style={{ fontSize: isMobile?15:17, color: i%3===1||i%3===2 ? "#0a0a0a" : CREAM, lineHeight:1.7, fontFamily:"'Jost',sans-serif", margin:0 }}>{cat.shift}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ background:BLACK, padding: isMobile?"56px 20px 72px":"72px 24px 96px", textAlign:"center" }}>
        <div style={{ fontSize:11, letterSpacing:"0.22em", textTransform:"uppercase", color:MU, marginBottom:28 }}>Find your frequency</div>
        <h2 style={{ fontFamily:"'Jost',sans-serif", fontSize: isMobile?"clamp(26px,7vw,38px)":"clamp(32px,4vw,48px)", color:CREAM, fontWeight:400, marginBottom:16, lineHeight:1.2 }}>
          Pick the category that's been living rent-free in your head.
        </h2>
        <p style={{ fontSize: isMobile?15:17, color:"rgba(253,240,232,0.75)", maxWidth:480, margin:"0 auto 40px", lineHeight:1.7 }}>
          That's your gap. That's where you start. Everything else follows.
        </p>
        <button onClick={()=>{ navigate("/"); setTimeout(()=>{ const el=document.getElementById("pricing"); if(el) el.scrollIntoView({behavior:"smooth"}); },300); }} style={{ background:LG, border:"none", borderRadius:40, padding: isMobile?"18px 44px":"22px 60px", color:BLACK, fontSize: isMobile?16:18, fontFamily:"'Jost',sans-serif", fontWeight:400, cursor:"pointer", letterSpacing:"0.02em" }}>
          Join Self Hypnosis Goddess →
        </button>
      </div>

    </div>
  );
}
