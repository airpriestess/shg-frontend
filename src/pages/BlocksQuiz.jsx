import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const LG = "linear-gradient(110deg,#F5E0A0 0%,#E8B870 22%,#BFA5D8 52%,#2CB7A7 78%,#167A6B 100%)";
const SUPABASE_URL = "https://qtwvslrwmreazmrdktsn.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0d3ZzbHJ3bXJlYXptcmRrdHNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk4MzA0MDAsImV4cCI6MjAyNTQwNjQwMH0.example";

const CAT_MAP = { richgirl: "money", lovemaxxing: "love", beautymaxxing: "beauty", selfmaxxing: "self", luckygirl: "lucky" };
const CATEGORIES = {
  money:   { name: "RichGirl Maxxing",  color: "#E8B870", label: "RichGirl block" },
  love:    { name: "LoveMaxxing",       color: "#BFA5D8", label: "Love block"     },
  beauty:  { name: "BeautyMaxxing",     color: "#F5E0A0", label: "Beauty block"   },
  self:    { name: "SelfMaxxing",       color: "#2CB7A7", label: "Self block"     },
  lucky:   { name: "LuckyGirl Maxxing", color: "#E8B870", label: "Luck block"     },
};

const QUESTIONS = {
  money: [
    { q: "A friend asks to borrow £200. You have it. Your gut reaction is...", opts: [
      { t: "I feel guilty saying no but terrified of saying yes", c: "scarcity" },
      { t: "I say yes immediately even though I resent it", c: "worthiness" },
      { t: "I say yes, then spend the next week anxious about my account", c: "scarcity" },
      { t: "I want to help but I feel like I need it more than they think", c: "consistency" }
    ]},
    { q: "You want to spoil your best friend for her birthday. You find the perfect gift — £150. You feel...", opts: [
      { t: "Excited, then immediately calculating what I can't buy myself this month", c: "scarcity" },
      { t: "Guilty — like I haven't earned the right to spend like this yet", c: "worthiness" },
      { t: "Happy to do it but I'll secretly hope she reciprocates", c: "consistency" },
      { t: "Resistant — £150 feels like too much even though I wish it didn't", c: "scarcity" }
    ]},
    { q: "You've been at the same income level for months. You want more. The story you tell yourself is...", opts: [
      { t: "I work hard but money just doesn't flow easily to me", c: "scarcity" },
      { t: "I haven't done enough to deserve a higher level yet", c: "worthiness" },
      { t: "Good things come and go — I can't count on consistent growth", c: "consistency" },
      { t: "I don't want to be seen as greedy or money-obsessed", c: "visibility" }
    ]},
    { q: "Someone offers you a generous opportunity — more than you expected to receive. You think...", opts: [
      { t: "There must be a catch — this is too good", c: "scarcity" },
      { t: "Why me? There are people more qualified than I am", c: "worthiness" },
      { t: "I'll believe it when the money is actually in my account", c: "consistency" },
      { t: "What will people think if I suddenly have this?", c: "visibility" }
    ]},
    { q: "You treat yourself to something expensive — a nice dinner, a luxury item. Afterwards you feel...", opts: [
      { t: "Guilty — like I should have saved it", c: "scarcity" },
      { t: "Like I hadn't quite earned it yet", c: "worthiness" },
      { t: "Good in the moment, then anxious the next day", c: "consistency" },
      { t: "Self-conscious — like someone will judge the choice", c: "visibility" }
    ]},
    { q: "When you imagine being genuinely wealthy — money that stays, that grows — it feels...", opts: [
      { t: "Like a fantasy that happens to other people, not me", c: "scarcity" },
      { t: "Possible only if I work harder than I currently do", c: "worthiness" },
      { t: "Exciting but I don't trust it would last", c: "consistency" },
      { t: "Slightly uncomfortable — I wouldn't know how to act", c: "visibility" }
    ]},
    { q: "Money arrives out of nowhere — an unexpected payment, a refund, a win. Your first feeling is...", opts: [
      { t: "Relief, then immediately spending it before it disappears", c: "scarcity" },
      { t: "Surprise — like it wasn't really meant for me", c: "worthiness" },
      { t: "Happy, but I don't let myself get too used to it", c: "consistency" },
      { t: "Fine, but I don't tell anyone — it feels too exposed", c: "visibility" }
    ]},
    { q: "The RichGirl version of you receives money easily, gives generously, and never panics about her account. Right now that feels...", opts: [
      { t: "Like someone else's life — not available to me yet", c: "scarcity" },
      { t: "Like something I have to earn my way into first", c: "worthiness" },
      { t: "Possible in theory but I can't feel it as real", c: "consistency" },
      { t: "Slightly terrifying — that level of visibility feels like a lot", c: "visibility" }
    ]}
  ],
  love: [
    { q: "You meet someone you really like. Before long you start thinking...", opts: [
      { t: "Is he interested in me or just being friendly?", c: "worthiness" },
      { t: "There are prettier, more interesting girls he could choose", c: "comparison" },
      { t: "Don't get too attached — it probably won't go anywhere", c: "safety" },
      { t: "I need to be perfect right now or I'll lose this", c: "performance" }
    ]},
    { q: "He goes quiet for a day or two. Your gut says...", opts: [
      { t: "He's losing interest — I probably did something wrong", c: "worthiness" },
      { t: "Someone else has his attention now", c: "comparison" },
      { t: "This always happens. Good things don't last for me.", c: "safety" },
      { t: "I need to say or do something to bring him back", c: "performance" }
    ]},
    { q: "A guy chooses you — clearly, directly. Your first instinct is...", opts: [
      { t: "Wait for him to realise he made a mistake", c: "worthiness" },
      { t: "Wonder what he sees that I don't see in myself", c: "comparison" },
      { t: "Stay a little guarded just in case it changes", c: "safety" },
      { t: "Make sure I keep being whoever made him choose me", c: "performance" }
    ]},
    { q: "You see a girl your ex is now dating. She's beautiful. You feel...", opts: [
      { t: "Like it confirms what I already feared — I wasn't enough", c: "worthiness" },
      { t: "Like beauty is something I'm always losing to", c: "comparison" },
      { t: "Like love always finds someone else more easily", c: "safety" },
      { t: "Pressure to look better, do more, be more", c: "performance" }
    ]},
    { q: "In relationships, you tend to...", opts: [
      { t: "Give more than you receive and call it love", c: "performance" },
      { t: "Minimise your needs so he doesn't feel overwhelmed", c: "worthiness" },
      { t: "Keep one foot out in case it doesn't work", c: "safety" },
      { t: "Compare yourself to girls he's been with before", c: "comparison" }
    ]},
    { q: "Being truly chosen — without performing, without earning it — feels...", opts: [
      { t: "Like something I have to work harder to deserve", c: "worthiness" },
      { t: "Unlikely when there are women who are more everything than me", c: "comparison" },
      { t: "Too good to be true — something would go wrong", c: "safety" },
      { t: "Possible only when I'm at my best, not on an average day", c: "performance" }
    ]},
    { q: "You want love that feels safe, easy, and certain. Right now that feels...", opts: [
      { t: "Like I haven't become the woman who gets that yet", c: "worthiness" },
      { t: "Like other women have it naturally but I have to fight for it", c: "comparison" },
      { t: "Like something I'm scared to want too loudly", c: "safety" },
      { t: "Only possible if I stay on — always showing up perfectly", c: "performance" }
    ]},
    { q: "The Lovemaxxing version of you is chosen first, loved easily, and never competes. Right now that feels...", opts: [
      { t: "Like I'm not quite the woman that happens to yet", c: "worthiness" },
      { t: "Hard to believe when I compare myself to other women", c: "comparison" },
      { t: "Like something beautiful that I'm scared to trust", c: "safety" },
      { t: "Like I'd have to be perfect every day to maintain it", c: "performance" }
    ]}
  ],
  beauty: [
    { q: "You're getting ready to go out. You look in the mirror. The first thought is...", opts: [
      { t: "I need to fix this before I leave", c: "acceptance" },
      { t: "She would look so much better in this than I do", c: "comparison" },
      { t: "I look okay but I wish I looked like I did two years ago", c: "acceptance" },
      { t: "I move on quickly — I don't really let myself look", c: "avoidance" }
    ]},
    { q: "Someone gorgeous walks into the room. You feel...", opts: [
      { t: "Immediately aware of everything I wish I could change", c: "comparison" },
      { t: "Fine — but slightly less confident than a second ago", c: "comparison" },
      { t: "Inspired but also quietly deflated", c: "acceptance" },
      { t: "Nothing — I've learned not to compare, I just go quiet", c: "avoidance" }
    ]},
    { q: "Someone calls you beautiful. You...", opts: [
      { t: "Deflect it — they're just being nice", c: "worthiness" },
      { t: "Accept it, then immediately think of someone who's more beautiful", c: "comparison" },
      { t: "Feel it for a second, then remember what still needs fixing", c: "acceptance" },
      { t: "Feel uncomfortable — I don't like that kind of attention", c: "avoidance" }
    ]},
    { q: "You're in a photo and you don't like how you look. You feel...", opts: [
      { t: "Like I need to lose weight or change something before the next one", c: "acceptance" },
      { t: "Like everyone else in the photo looks so much better", c: "comparison" },
      { t: "Like I'll never look the way I want to in photos", c: "worthiness" },
      { t: "Like deleting it — I'd rather not be seen like this", c: "avoidance" }
    ]},
    { q: "You post a photo of yourself. While waiting for responses you feel...", opts: [
      { t: "Anxious — what if I don't get as many likes as her?", c: "comparison" },
      { t: "Slightly exposed — what if they notice what I notice?", c: "avoidance" },
      { t: "Okay but I'm already critiquing what I should have done differently", c: "acceptance" },
      { t: "Like I had to look a certain way to justify posting at all", c: "worthiness" }
    ]},
    { q: "Feeling gorgeous in your body right now, exactly as you are, feels...", opts: [
      { t: "Like something I'll earn when I hit my goal", c: "acceptance" },
      { t: "Hard when there are women who are naturally so much more beautiful", c: "comparison" },
      { t: "Like something I haven't quite deserved yet", c: "worthiness" },
      { t: "Uncomfortable — I don't like thinking about my body that much", c: "avoidance" }
    ]},
    { q: "When you imagine being a woman who wakes up and just feels beautiful — no fixing needed — that feels...", opts: [
      { t: "Like I'd have to change my body first", c: "acceptance" },
      { t: "Like some women are just born like that — I wasn't", c: "comparison" },
      { t: "Like something I haven't earned the right to feel yet", c: "worthiness" },
      { t: "Like I'd feel too visible and I'm not sure I want that", c: "avoidance" }
    ]},
    { q: "The Beautymaxxing version of you wakes up gorgeous, stays gorgeous, and never competes. Right now that feels...", opts: [
      { t: "Like a future version of me that requires a lot of work first", c: "acceptance" },
      { t: "Like something that comes naturally to other women but not me", c: "comparison" },
      { t: "Like I haven't done enough to step into that identity yet", c: "worthiness" },
      { t: "Like being that visible would actually make me uncomfortable", c: "avoidance" }
    ]}
  ],
  lucky: [
    { q: "Something good happens out of nowhere. Your first thought is...", opts: [
      { t: "Enjoy it now, because it probably won't last", c: "impermanence" },
      { t: "That kind of thing happens to other people, not really to me", c: "identity" },
      { t: "I'm waiting for the catch — it can't just be this easy", c: "safety" },
      { t: "I probably had something to do with it going right", c: "agency" }
    ]},
    { q: "You miss a connection or opportunity you didn't see coming. You think...", opts: [
      { t: "This always happens — I miss the moment every time", c: "identity" },
      { t: "I wasn't ready. I need to work on myself first.", c: "safety" },
      { t: "Lucky people just find those connections naturally. I don't.", c: "identity" },
      { t: "I wasn't looking for it — my filter needs updating", c: "awareness" }
    ]},
    { q: "A plan falls through at the last minute. You feel...", opts: [
      { t: "Confirmation — things rarely go smoothly for me", c: "identity" },
      { t: "Anxious — what if this is a sign I should stop trying?", c: "safety" },
      { t: "Frustrated, but I start looking for what opened up instead", c: "agency" },
      { t: "Like I should have known better than to get excited", c: "impermanence" }
    ]},
    { q: "Someone you know seems to effortlessly attract good things. You feel...", opts: [
      { t: "Like they have something I don't and probably never will", c: "identity" },
      { t: "Happy for them, but quietly aware that luck skips me", c: "identity" },
      { t: "Curious — what are they doing differently?", c: "agency" },
      { t: "Like luck is randomly distributed and I got a smaller share", c: "impermanence" }
    ]},
    { q: "When you imagine your life going really, genuinely well — it feels...", opts: [
      { t: "Nice to think about but I don't really let myself believe it", c: "safety" },
      { t: "Like it's for people who started with more than I did", c: "identity" },
      { t: "Possible but I'm terrified to want it in case it doesn't happen", c: "safety" },
      { t: "Like it's coming — I just haven't quite arrived yet", c: "agency" }
    ]},
    { q: "When a good opportunity closes, your automatic thought is...", opts: [
      { t: "That was probably my one chance and I missed it", c: "impermanence" },
      { t: "Lucky people would have seen it coming. I didn't.", c: "identity" },
      { t: "Something better is probably on its way", c: "agency" },
      { t: "I need to be more prepared so I don't miss the next one", c: "safety" }
    ]},
    { q: "How do you feel about the word lucky in relation to yourself?", opts: [
      { t: "Uncomfortable — it feels like I'm tempting fate", c: "safety" },
      { t: "Distant — luck is something other people have", c: "identity" },
      { t: "I believe it sometimes, but I don't trust it to stay", c: "impermanence" },
      { t: "Like something I'm in the process of becoming", c: "agency" }
    ]},
    { q: "The LuckyGirl assumes life works for her — timing, people, opportunities. Right now that feels...", opts: [
      { t: "Like an identity that was never really available to me", c: "identity" },
      { t: "Possible, but I would need everything to go right first", c: "safety" },
      { t: "Real in moments — but I don't trust it to be permanent", c: "impermanence" },
      { t: "Closer than it has ever felt — I just need to install it properly", c: "agency" }
    ]}
  ],
  self: [
    { q: "You walk into a room full of successful people. You feel...", opts: [
      { t: "Aware that I haven't achieved enough to belong here yet", c: "readiness" },
      { t: "Like I'm not quite the calibre of person in this room", c: "worthiness" },
      { t: "Excited, then quietly wondering if they'll see through me", c: "visibility" },
      { t: "Good — until someone more impressive walks in", c: "safety" }
    ]},
    { q: "Someone introduces you and says something really impressive about you. You feel...", opts: [
      { t: "Slightly fraudulent — like they've got me confused with who I'm becoming", c: "readiness" },
      { t: "Like I need to qualify it — 'oh it's not that impressive'", c: "worthiness" },
      { t: "Warm, then immediately worried I won't live up to it", c: "visibility" },
      { t: "Good in the moment, then anxious about maintaining the image", c: "safety" }
    ]},
    { q: "You have a big opportunity in front of you. The voice that holds you back says...", opts: [
      { t: "You're not ready yet — do more prep first", c: "readiness" },
      { t: "Who do you think you are? There are better people for this", c: "worthiness" },
      { t: "What if everyone sees you fail publicly?", c: "visibility" },
      { t: "What if you get it and then lose it?", c: "safety" }
    ]},
    { q: "You think about the upgraded version of you — fully in her power. She feels...", opts: [
      { t: "Real but far — I still have so much to do before I'm her", c: "readiness" },
      { t: "Like a version I haven't earned the right to be yet", c: "worthiness" },
      { t: "Exciting but also terrifying — she's very visible", c: "visibility" },
      { t: "Like something I'm scared to want too loudly in case it doesn't happen", c: "safety" }
    ]},
    { q: "When things are going really well in your life, you feel...", opts: [
      { t: "Like I'm not quite ready for this level yet", c: "readiness" },
      { t: "Like I don't fully deserve it", c: "worthiness" },
      { t: "Exposed — like more people are watching and I could mess up", c: "visibility" },
      { t: "Happy, but already waiting for it to end", c: "safety" }
    ]},
    { q: "Choosing yourself — your standards, your pace, your desires — feels...", opts: [
      { t: "Like something I'll do when I've achieved more first", c: "readiness" },
      { t: "Like I haven't done enough to justify it yet", c: "worthiness" },
      { t: "Like it would make me look arrogant or difficult", c: "visibility" },
      { t: "Risky — what if I lose people who are used to the old me?", c: "safety" }
    ]},
    { q: "Being fully seen — your ambition, your desires, your power — feels...", opts: [
      { t: "Like something I'll allow when I'm more ready", c: "readiness" },
      { t: "Like something I have to earn the right to first", c: "worthiness" },
      { t: "Genuinely terrifying — I've always stayed a bit under the radar", c: "visibility" },
      { t: "Like it could change relationships I'm not ready to lose", c: "safety" }
    ]},
    { q: "The Selfmaxxing version of you takes up space, owns her power, and never shrinks. Right now that feels...", opts: [
      { t: "Like a future version — I'm not quite there yet", c: "readiness" },
      { t: "Like something I need to achieve more to deserve", c: "worthiness" },
      { t: "Incredible but also very exposed and vulnerable", c: "visibility" },
      { t: "Like she might lose the people who like the smaller version of me", c: "safety" }
    ]}
  ]
};


const RESULTS = {
  lucky: {
    identity:     { block: "The Outsider Identity",    old: "Luck is something other people have. I was not born with it.", new: "Luck is an identity. I have installed it now. It runs automatically." },
    impermanence: { block: "The Impermanence Block",   old: "Good things happen sometimes — but I cannot trust them to last.", new: "Good things stay. I am the kind of woman life works for. Of course." },
    safety:       { block: "The Safety Trap",          old: "If I believe I am lucky and it does not work out, the disappointment will be unbearable.", new: "I assume the best outcome. Of course it worked out. It always does." },
    awareness:    { block: "The Awareness Gap",        old: "Lucky people see opportunities I miss. I am not tuned to the right frequency.", new: "My filter is updating. Same room. Different eye. I see what is for me." },
    agency:       { block: "The Waiting Pattern",      old: "I know luck is possible. I am just waiting for it to arrive.", new: "I do not wait for luck. I am the identity that luck recognises." }
  },
  money: {
    scarcity:    { block: "The Scarcity Loop",         old: '"Money avoids me. There\'s never enough, and what arrives always leaves."',                                        new: "Money finds me first. Of course it does." },
    worthiness:  { block: "The Earning Trap",          old: '"I have to work hard for every pound. Receiving without effort feels wrong."',                                     new: "I am someone money flows to easily and stays with." },
    consistency: { block: "The Feast or Famine Pattern", old: '"Money comes and goes. I can never count on it staying."',                                                       new: "My income only goes up from here." },
    visibility:  { block: "The Visibility Block",      old: '"Having money makes me a target. It\'s safer to stay under the radar."',                                           new: "I receive abundantly and unapologetically." }
  },
  love: {
    worthiness:  { block: "The Earning Loop",          old: '"I have to earn love through what I do. Being chosen freely feels too good to be true."',                         new: "He chooses me. Every time. Obviously." },
    safety:      { block: "The Guarded Heart",         old: '"Love is dangerous. If I trust fully, I\'ll get hurt."',                                                           new: "Love is safe and it stays with me." },
    consistency: { block: "The Expiry Fear",           old: '"Love always ends. I spend relationships waiting for it to run out."',                                             new: "The right person finds me right when they should." },
    visibility:  { block: "The Hiding Pattern",        old: '"Being fully seen means being fully rejected. I stay small to stay safe."',                                        new: "Being fully seen is what makes me magnetic." }
  },
  beauty: {
    acceptance:  { block: "The Conditional Beauty Block", old: '"I\'ll feel beautiful when I fix this. Gorgeous is something I\'m working towards, not something I already am."', new: "Gorgeous is my default. Always has been." },
    comparison:  { block: "The Comparison Trap",       old: '"There\'s always someone who looks better. My beauty only counts if it wins."',                                    new: "I don\'t compare — I\'m in a category of my own." },
    worthiness:  { block: "The Born-With-It Block",    old: '"I wasn\'t born naturally beautiful. Beauty isn\'t really available to me."',                                      new: "I am the most beautiful version of myself right now." },
    avoidance:   { block: "The Invisibility Pattern",  old: '"Being noticed for how I look feels unsafe. I don\'t let myself be seen."',                                        new: "Being seen is safe. I glow and I let people notice." }
  },
  self: {
    readiness:   { block: "The Not-Yet Trap",          old: '"I\'m not ready yet. I need to do more, become more, before I can be her."',                                       new: "I am the upgraded version. She is here now." },
    worthiness:  { block: "The Worthiness Wall",       old: '"I\'m not the kind of person who gets to have that. I haven\'t earned it yet."',                                   new: "I am exactly worthy of everything I desire." },
    safety:      { block: "The Good Things Leave Pattern", old: '"Good things don\'t last for people like me. When life gets too good, something always takes it away."',        new: "Good things are safe with me. They stay." },
    visibility:  { block: "The Shrinking Pattern",     old: '"Standing out is dangerous. I stay small so I don\'t get judged or lose people."',                                 new: "Being fully seen is my superpower." }
  }
};

const RITUAL = "Say your new assumption aloud right before sleep — that's the theta window, when your subconscious stops arguing with it. Two minutes. Every night. 21 nights. That's the install window.";



function SHGNav() {
  const navigate = useNavigate();
  return (
    <nav style={{ display:"flex", alignItems:"center", padding:"0 20px", height:54, borderBottom:"1px solid #1c1828", background:"rgba(0,0,0,0.97)", backdropFilter:"blur(20px)", gap:9, cursor:"pointer" }} onClick={()=>navigate("/")}>
      <svg viewBox="0 0 100 100" width="24" height="24" style={{flexShrink:0}}>
        <defs><linearGradient id="shgnav" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#F5E0A0"/><stop offset="20%" stopColor="#E8B870"/><stop offset="52%" stopColor="#BFA5D8"/><stop offset="78%" stopColor="#2CB7A7"/><stop offset="100%" stopColor="#167A6B"/></linearGradient></defs>
        <circle cx="35" cy="35" r="18" fill="none" stroke="url(#shgnav)" strokeWidth="2"/>
        <circle cx="65" cy="35" r="18" fill="none" stroke="url(#shgnav)" strokeWidth="2"/>
        <circle cx="35" cy="65" r="18" fill="none" stroke="url(#shgnav)" strokeWidth="2"/>
        <circle cx="65" cy="65" r="18" fill="none" stroke="url(#shgnav)" strokeWidth="2"/>
        <line x1="50" y1="80" x2="50" y2="96" stroke="url(#shgnav)" strokeWidth="2" strokeLinecap="round"/>
      </svg>
      <span style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontWeight:400, fontSize:"clamp(12px,3.4vw,15px)", letterSpacing:"0.02em", color:"#f2ece4", whiteSpace:"nowrap" }}>Self Hypnosis Goddess</span>
    </nav>
  );
}

export default function BlocksQuiz() {
  const { category } = useParams();
  const navigate = useNavigate();
  const cat = CATEGORIES[category];

  const [phase, setPhase] = useState("landing");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState({});
  const [result, setResult] = useState(null);

  if (!cat) {
    navigate("/blocks");
    return null;
  }

  const qs = QUESTIONS[category];

  function submitEmail(e) {
    e && e.preventDefault();
    if (!name.trim()) { setEmailError("Just need your first name."); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setEmailError("That email doesn't look right."); return; }
    setEmailError("");
    setPhase("quiz");
    window.scrollTo(0, 0);
  }

  function pickAnswer(code) {
    const newScores = { ...scores, [code]: (scores[code] || 0) + 1 };
    setScores(newScores);
    const nextStep = step + 1;
    if (nextStep < qs.length) {
      setStep(nextStep);
      window.scrollTo(0, 0);
    } else {
      const topCode = Object.entries(newScores).sort((a, b) => b[1] - a[1])[0][0];
      const r = RESULTS[category][topCode];
      setResult(r);
      saveToSupabase(name, email, category, topCode);
      setPhase("result");
      window.scrollTo(0, 0);
    }
  }

  async function saveToSupabase(n, e, c, block) {
    const tableMap = { money: "quiz_richgirl", richgirl: "quiz_richgirl", lucky: "quiz_luckygirl", luckygirl: "quiz_luckygirl", love: "quiz_lovemaxxing", lovemaxxing: "quiz_lovemaxxing", beauty: "quiz_beautymaxxing", beautymaxxing: "quiz_beautymaxxing", self: "quiz_selfmaxxing", selfmaxxing: "quiz_selfmaxxing" };
    const table = tableMap[c] || "quiz_leads";
    try {
      await fetch(SUPABASE_URL + "/rest/v1/" + table, {
        method: "POST",
        headers: { "Content-Type": "application/json", "apikey": SUPABASE_ANON, "Authorization": "Bearer " + SUPABASE_ANON, "Prefer": "return=minimal" },
        body: JSON.stringify({ name: n, email: e, block: block, created_at: new Date().toISOString() })
      });
    } catch (_) {}
  }

  const base = { background: "linear-gradient(110deg,#F5E0A0 0%,#E8B870 22%,#BFA5D8 52%,#2CB7A7 78%,#167A6B 100%)", color: "#000", fontFamily: "'Jost', sans-serif", fontWeight: 400, minHeight: "100vh" };
  const inputStyle = { width: "100%", background: "rgba(255,255,255,0.9)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: 14, padding: "20px 22px", color: "#000", fontFamily: "'Jost', sans-serif", fontSize: 17, fontWeight: 300, outline: "none", marginBottom: 14, display: "block" };
  const btnStyle = { width: "100%", border: "none", borderRadius: 40, padding: "22px 20px", fontFamily: "'Jost', sans-serif", fontSize: 17, fontWeight: 400, letterSpacing: ".04em", cursor: "pointer", color: "#000", background: LG, display: "block" };
  const optStyle = { background: "rgba(255,255,255,0.85)", border: "2px solid transparent", borderRadius: 14, padding: "22px 24px", color: "#000", fontFamily: "'Jost', sans-serif", fontSize: 17, fontWeight: 400, textAlign: "left", cursor: "pointer", lineHeight: 1.6, width: "100%", marginBottom: 12, transition: "all 0.2s" };

  return (
    <div style={base}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,400&family=Jost:wght@300;400;500&display=swap" rel="stylesheet"/>

      <SHGNav/>

      {phase === "landing" && (
        <div style={{ textAlign: "center", padding: "64px 24px 48px", background: "linear-gradient(110deg,#F5E0A0 0%,#E8B870 22%,#BFA5D8 52%,#2CB7A7 78%,#167A6B 100%)" }}>
          <div style={{ display: "inline-block", fontSize: 11, letterSpacing: ".28em", textTransform: "uppercase", marginBottom: 28, background: LG, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
            ✦ {cat.label} ✦
          </div>
          <h1 style={{ fontFamily: "'Jost', sans-serif", fontWeight: 400, fontSize: "clamp(40px,7vw,76px)", lineHeight: 1.05, color: "#000", marginBottom: 16, letterSpacing: "-.02em" }}>
            What's blocking your<br/>{cat.name} era?
          </h1>
          <p style={{ fontSize: 17, color: "rgba(0,0,0,0.65)", lineHeight: 1.7, maxWidth: 420, margin: "20px auto 48px" }}>
            8 questions. Your invisible block — named, and replaced.
          </p>
          <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 24px" }}>
            <input style={inputStyle} placeholder="First name" value={name} onChange={e => setName(e.target.value)}/>
            <input style={inputStyle} placeholder="Email address" type="email" value={email} onChange={e => setEmail(e.target.value)}/>
            {emailError && <p style={{ color: "#BFA5D8", fontSize: 13, marginBottom: 10 }}>{emailError}</p>}
            <button style={btnStyle} onClick={submitEmail}>Find my block</button>
          </div>
        </div>
      )}

      {phase === "quiz" && (
        <div style={{ maxWidth: 560, margin: "0 auto", padding: "48px 24px 80px" }}>
          <div style={{ display: "flex", gap: 5, justifyContent: "center", marginBottom: 28 }}>
            {qs.map((_, i) => (
              <div key={i} style={{ height: 2, borderRadius: 2, background: i < step ? "#000" : "rgba(0,0,0,0.2)", flex: 1, maxWidth: 48, transition: "background .3s" }}/>
            ))}
          </div>
          <div style={{ fontSize: 10, letterSpacing: ".2em", textTransform: "uppercase", color: "rgba(0,0,0,0.5)", textAlign: "center", marginBottom: 24 }}>{step + 1} of {qs.length}</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "clamp(26px,5vw,38px)", fontWeight: 400, textAlign: "center", marginBottom: 40, color: "#000", lineHeight: 1.35 }}>
            {qs[step].q}
          </div>
          <div>
            {qs[step].opts.map((opt, i) => (
              <button key={i} style={optStyle} onClick={() => pickAnswer(opt.c)}
                onMouseEnter={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.border = "2px solid #000"; e.currentTarget.style.transform = "scale(1.01)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.85)"; e.currentTarget.style.border = "2px solid transparent"; e.currentTarget.style.transform = "scale(1)"; }}>
                {opt.t}
              </button>
            ))}
          </div>
        </div>
      )}

      {phase === "result" && result && (
        <>
          <div style={{ padding: "48px 0 0", textAlign: "center" }}>
            <div style={{ display: "inline-block", fontSize: 11, letterSpacing: ".28em", textTransform: "uppercase", marginBottom: 16, background: LG, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
              ✦ Your {cat.label} ✦
            </div>
          </div>
          <div style={{ maxWidth: 560, margin: "0 auto", padding: "0 24px 80px", textAlign: "center" }}>
            <h2 style={{ fontFamily: "'Jost', sans-serif", fontWeight: 400, fontSize: "clamp(28px,5vw,48px)", lineHeight: 1.1, color: "#f2ece4", marginBottom: 36, letterSpacing: "-.01em" }}>{result.block}</h2>
            <div style={{ background: "rgba(0,0,0,0.12)", border: "1px solid rgba(0,0,0,0.15)", borderRadius: 16, padding: 28, marginBottom: 16, textAlign: "left" }}>
              <div style={{ fontSize: 10, letterSpacing: ".15em", textTransform: "uppercase", color: "#000", marginBottom: 12 }}>The assumption running your life</div>
              <div style={{ fontSize: 16, color: "#000", fontStyle: "italic", lineHeight: 1.7 }}>{result.old}</div>
            </div>
            <div style={{ borderRadius: 16, padding: 32, marginBottom: 16, textAlign: "center", background: LG }}>
              <div style={{ fontSize: 10, letterSpacing: ".15em", textTransform: "uppercase", color: "rgba(0,0,0,0.45)", marginBottom: 14 }}>Your new assumption</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "clamp(22px,4vw,32px)", color: "#000", fontWeight: 400, lineHeight: 1.35 }}>{result.new}</div>
            </div>
            <div style={{ background: "rgba(0,0,0,0.1)", border: "1px solid rgba(0,0,0,0.15)", borderRadius: 16, padding: 28, marginBottom: 32, textAlign: "left" }}>
              <div style={{ fontSize: 10, letterSpacing: ".15em", textTransform: "uppercase", background: LG, WebkitBackgroundClip: "text", backgroundClip: "text", color: "#000", marginBottom: 12, display: "inline-block" }}>Your install ritual</div>
              <div style={{ fontSize: 16, color: "#000", lineHeight: 1.8 }}>{RITUAL}</div>
            </div>
            <p style={{ fontSize: 14, color: "#000", marginBottom: 20, lineHeight: 1.7 }}>This is exactly what your SHG audio installs — hypnosis, subliminals, and binaural beats that replace this assumption while you sleep, until your nervous system accepts it as fact.</p>
            <div style={{ background: "rgba(0,0,0,0.08)", border: "2px dashed rgba(0,0,0,0.2)", borderRadius: 20, padding: "36px 28px", textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: "rgba(0,0,0,0.4)", marginBottom: 12 }}>✦ Coming soon ✦</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "clamp(24px,4vw,36px)", color: "#000", fontWeight: 400, lineHeight: 1.2, marginBottom: 12 }}>RichGirl Maxxing</div>
              <div style={{ fontSize: 15, color: "rgba(0,0,0,0.6)", lineHeight: 1.7 }}>The workbook, audio, and 21-day practice for this specific block. Coming very soon.</div>
            </div>
            <a href="/" style={{ display: "inline-block", border: "2px solid #000", borderRadius: 40, padding: "18px 40px", color: "#000", fontFamily: "'Jost', sans-serif", fontSize: 16, fontWeight: 500, letterSpacing: ".04em", cursor: "pointer", textDecoration: "none" }}>Explore Self Hypnosis Goddess</a>
          </div>
        </>
      )}
    </div>
  );
}
