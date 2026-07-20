/* Legal pages — ToS, Privacy, Refund */
const GOLD = "#C8860A";
const CR = "#f2ece4";
const MU = "#9a8878";
const OMBRE = "linear-gradient(135deg,#C8960A 0%,#C8860A 50%,#2CB7A7 100%)";

const LAST_UPDATED = "13 July 2026";
const COMPANY = "Self Hypnosis Goddess";
const EMAIL = "hello@reshmaoracle.com";
const SITE = "reshmaoracle.com";

function LegalShell({ title, eyebrow, children, onBack }) {
  return (
    <div style={{ minHeight:"100vh", background:"#000", color:CR, fontFamily:"'Jost',sans-serif" }}>
      <div style={{ maxWidth:720, margin:"0 auto", padding:"48px 24px 80px" }}>
        <button onClick={onBack} style={{ background:"none", border:"none", color:MU, fontSize:13, cursor:"pointer", marginBottom:32, display:"flex", alignItems:"center", gap:8, fontFamily:"'Jost',sans-serif" }}>
          ← Back
        </button>
        <div style={{ fontSize:11, color:GOLD, letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:12 }}>{eyebrow}</div>
        <h1 style={{ fontSize:"clamp(28px,5vw,44px)", fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", color:CR, marginBottom:8, lineHeight:1.15 }}>{title}</h1>
        <div style={{ fontSize:12, color:MU, marginBottom:48 }}>Last updated: {LAST_UPDATED}</div>
        <div style={{ fontSize:15, lineHeight:1.9, color:"#c8bcb0" }}>{children}</div>
      </div>
    </div>
  );
}

function H2({ children }) {
  return <h2 style={{ fontSize:18, color:CR, fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", margin:"40px 0 12px", borderBottom:"1px solid rgba(44,183,167,0.15)", paddingBottom:8 }}>{children}</h2>;
}
function P({ children }) {
  return <p style={{ margin:"0 0 16px", color:"#c8bcb0" }}>{children}</p>;
}
function Li({ children }) {
  return <li style={{ margin:"6px 0", paddingLeft:4 }}>{children}</li>;
}

export function TermsOfService({ onBack }) {
  return (
    <LegalShell title="Terms of Service" eyebrow="Legal" onBack={onBack}>
      <P>By accessing or using {SITE} or any {COMPANY} product, you agree to these terms. If you do not agree, do not use the service.</P>

      <H2>1. The service</H2>
      <P>{COMPANY} provides self-hypnosis and subliminal audio content, a manifestation tracking tool (ProofOS), and related digital products via a subscription or one-time purchase. Content is delivered digitally through the web application at {SITE}.</P>

      <H2>2. Eligibility</H2>
      <P>You must be at least 18 years old to subscribe or purchase. By using the service you confirm you meet this requirement.</P>

      <H2>3. Subscriptions and billing</H2>
      <P>Subscriptions are billed monthly or annually in GBP (£) via Stripe. Your subscription renews automatically at the end of each billing period unless you cancel. You can cancel at any time through your account settings or by contacting us at {EMAIL}. Cancellation takes effect at the end of the current billing period — you retain access until then.</P>
      <P>Lifetime access is a one-time payment granting permanent access to the tier purchased at the time of purchase. It does not guarantee access to future tiers or products not yet released.</P>

      <H2>4. Refunds</H2>
      <P>Please refer to our Refund Policy below. Digital products are non-refundable except where required by law.</P>

      <H2>5. Intellectual property</H2>
      <P>All audio content, scripts, branding, and platform features are the intellectual property of {COMPANY}. You may not reproduce, distribute, resell, or create derivative works from any content without written permission. Personal, non-commercial use is permitted.</P>

      <H2>6. Health disclaimer</H2>
      <P>{COMPANY} content is for personal development and entertainment purposes only. It is not a substitute for medical, psychological, or psychiatric treatment. If you have a diagnosed mental health condition, please consult a qualified professional before using hypnosis or subliminal audio.</P>

      <H2>7. Limitation of liability</H2>
      <P>{COMPANY} is not liable for any indirect, incidental, or consequential damages arising from use of the service. Our total liability in any circumstance is limited to the amount you paid in the 30 days prior to the claim.</P>

      <H2>8. Changes to these terms</H2>
      <P>We may update these terms from time to time. Material changes will be communicated by email. Continued use of the service after changes constitutes acceptance.</P>

      <H2>9. Governing law</H2>
      <P>These terms are governed by the laws of England and Wales. Any disputes will be subject to the exclusive jurisdiction of the courts of England and Wales.</P>

      <H2>10. Contact</H2>
      <P>For any questions about these terms, contact us at <span style={{ color:GOLD }}>{EMAIL}</span>.</P>
    </LegalShell>
  );
}

export function PrivacyPolicy({ onBack }) {
  return (
    <LegalShell title="Privacy Policy" eyebrow="Legal" onBack={onBack}>
      <P>This policy explains how {COMPANY} collects, uses, and protects your personal data when you use {SITE}.</P>

      <H2>1. What we collect</H2>
      <ul style={{ paddingLeft:20, margin:"0 0 16px" }}>
        <Li>Account information: email address, name (if provided)</Li>
        <Li>Subscription and billing data (processed by Stripe — we do not store card details)</Li>
        <Li>Usage data: tracks played, ProofOS entries, listening history</Li>
        <Li>Device and browser information for security and performance</Li>
        <Li>Push notification subscription data (if you opt in)</Li>
      </ul>

      <H2>2. How we use your data</H2>
      <ul style={{ paddingLeft:20, margin:"0 0 16px" }}>
        <Li>To provide and personalise the service</Li>
        <Li>To process payments and manage your subscription</Li>
        <Li>To send service-related emails (account, billing, updates)</Li>
        <Li>To send push notifications (only if you have opted in)</Li>
        <Li>To improve the platform through aggregate, anonymised analytics</Li>
      </ul>

      <H2>3. Data sharing</H2>
      <P>We do not sell your data. We share it only with service providers necessary to operate the platform: Stripe (payments), Supabase (database and authentication), and Vercel (hosting). All providers are bound by data processing agreements.</P>

      <H2>4. ProofOS data</H2>
      <P>Your manifestation entries, proof logs, emotional states, and listening history stored in ProofOS are private to your account. We do not read, share, or use this data for any purpose beyond delivering your personal experience.</P>

      <H2>5. Cookies</H2>
      <P>We use essential cookies for authentication and session management. We do not use advertising or third-party tracking cookies.</P>

      <H2>6. Your rights (UK GDPR)</H2>
      <P>You have the right to access, correct, or delete your personal data at any time. To exercise these rights, email <span style={{ color:GOLD }}>{EMAIL}</span>. We will respond within 30 days. You may also request a copy of your data in a portable format.</P>

      <H2>7. Data retention</H2>
      <P>We retain your account data for as long as your account is active. If you delete your account, your data is removed within 30 days, except where retention is required by law (e.g. billing records for 7 years).</P>

      <H2>8. Security</H2>
      <P>Your data is stored on Supabase with row-level security enabled — meaning each user can only access their own data. Authentication is handled via Supabase Auth. Payments are processed entirely by Stripe and never touch our servers.</P>

      <H2>9. Changes</H2>
      <P>We may update this policy. Material changes will be communicated by email to your registered address.</P>

      <H2>10. Contact</H2>
      <P>Questions or requests: <span style={{ color:GOLD }}>{EMAIL}</span></P>
    </LegalShell>
  );
}

export function RefundPolicy({ onBack }) {
  return (
    <LegalShell title="Refund Policy" eyebrow="Legal" onBack={onBack}>
      <P>We want you to feel confident before you subscribe. Here is exactly how refunds work.</P>

      <H2>Subscriptions — monthly and annual</H2>
      <P>We offer a 14-day refund window from the date of your first payment on a new subscription. If the product is not right for you, email <span style={{ color:GOLD }}>{EMAIL}</span> within 14 days and we will issue a full refund with no questions asked.</P>
      <P>After 14 days, subscription payments are non-refundable. You will retain access to the tier until the end of the billing period.</P>
      <P>Annual subscription refunds: if you are within 14 days of your annual renewal, you may request a refund. Beyond that window, annual subscriptions are non-refundable but you retain access for the full year paid.</P>

      <H2>Lifetime access</H2>
      <P>Lifetime access is a one-time payment and is non-refundable after purchase. Please review the tier features before purchasing.</P>

      <H2>Individual audio and digital products</H2>
      <P>All individual audio purchases and digital downloads are non-refundable once accessed or downloaded. This is standard for digital content under UK consumer law (Consumer Contracts Regulations 2013, Regulation 28).</P>

      <H2>Exceptions</H2>
      <P>If you experience a technical issue that prevents you from accessing the service, contact us at <span style={{ color:GOLD }}>{EMAIL}</span> and we will resolve it or issue a refund at our discretion.</P>
      <P>Nothing in this policy affects your statutory rights under UK consumer law.</P>

      <H2>How to request a refund</H2>
      <P>Email <span style={{ color:GOLD }}>{EMAIL}</span> with the subject line "Refund Request" and your account email address. We process refund requests within 5 business days. Refunds are returned to the original payment method and typically appear within 5–10 business days depending on your bank.</P>
    </LegalShell>
  );
}
