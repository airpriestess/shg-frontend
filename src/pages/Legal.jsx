/* Legal pages — ToS, Privacy, Refund */
import { useState } from "react";

const PAGES = {
  tos: {
    title: "Terms of Service",
    updated: "22 July 2026",
    sections: [
      { h: "1. The Service", body: `Self Hypnosis Goddess ("SHG", "we", "us") is a digital audio membership platform operated by Reshma Oracle. By accessing reshmaoracle.com or subscribing to any membership tier, you agree to these Terms of Service in full.\n\nThe service provides streaming access to original self-hypnosis audio content, subliminal audio, and related tools including ProofOS, a personal manifestation tracking tool. Content is for personal use only.` },
      { h: "2. Eligibility", body: `You must be at least 18 years old to subscribe. By subscribing, you confirm that you meet this requirement. SHG is not a medical service and is not a substitute for professional mental health support, therapy, or medical treatment.` },
      { h: "3. Membership and Billing", body: `Membership is billed monthly or annually depending on the plan selected at checkout. Billing is processed securely via Stripe. Your subscription renews automatically at the end of each billing period unless cancelled.\n\nLifetime membership is a one-time payment with no recurring billing.\n\nPrices are displayed in GBP (£) and are inclusive of any applicable taxes. We reserve the right to change pricing with 30 days' notice to existing subscribers.` },
      { h: "4. Cancellation", body: `You may cancel your subscription at any time from your account settings or by contacting us at hello@reshmaoracle.com. Cancellation takes effect at the end of the current billing period. You retain access to the vault until that date.\n\nCancellation does not entitle you to a refund except as set out in our Refund Policy.` },
      { h: "5. Intellectual Property", body: `All audio content, written materials, brand assets, and platform features are the exclusive intellectual property of Reshma Oracle. You may not download, copy, redistribute, sell, or share any content from the vault.\n\nPersonal listening for your own non-commercial use is the sole permitted use.` },
      { h: "6. Health Disclaimer", body: `SHG audio content is designed for general wellbeing, identity work, and subconscious reprogramming. It is not a medical device and makes no medical claims.\n\nIf you have a diagnosed mental health condition, epilepsy, or sensitivity to audio stimulation, please consult a qualified healthcare professional before use. Do not listen while driving or operating machinery.` },
      { h: "7. Limitation of Liability", body: `To the fullest extent permitted by applicable law, Reshma Oracle shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the service. Our total liability shall not exceed the amount paid by you in the 12 months preceding the claim.` },
      { h: "8. Changes to These Terms", body: `We may update these Terms at any time. Continued use of the service after changes take effect constitutes acceptance of the updated Terms. We will notify active subscribers of material changes by email.` },
      { h: "9. Governing Law", body: `These Terms are governed by the laws of England and Wales. Any disputes shall be subject to the exclusive jurisdiction of the courts of England and Wales.` },
      { h: "10. Contact", body: `For any questions regarding these Terms, contact us at hello@reshmaoracle.com.` },
    ]
  },
  privacy: {
    title: "Privacy Policy",
    updated: "22 July 2026",
    sections: [
      { h: "1. Who We Are", body: `Self Hypnosis Goddess is operated by Reshma Oracle. Our website is reshmaoracle.com. For privacy-related questions, contact us at hello@reshmaoracle.com.` },
      { h: "2. What Data We Collect", body: `We collect:\n\n• Account data: email address, name (if provided), and tier/subscription status when you create an account or subscribe.\n• Payment data: processed entirely by Stripe. We do not store your card details.\n• Usage data: tracks played, ProofOS entries you create, emotional state logs, and sign logs. This data is stored in your account only.\n• Technical data: IP address, browser type, and device information collected automatically when you visit the site.\n• Communications: emails you send us.` },
      { h: "3. How We Use Your Data", body: `We use your data to:\n\n• Provide and maintain your membership access\n• Process payments via Stripe\n• Send transactional emails (receipts, account notices)\n• Send marketing emails if you have opted in (you may unsubscribe at any time)\n• Improve the platform and fix bugs` },
      { h: "4. ProofOS Data", body: `Your intentions, signs, and Proof Wall entries in ProofOS are private to your account. We do not read, share, or use this content for any purpose other than displaying it back to you. You may delete any or all ProofOS data from within the app at any time.` },
      { h: "5. Data Sharing", body: `We do not sell your personal data. We share data only with:\n\n• Stripe — for payment processing\n• Supabase — our database and authentication provider\n• Vercel — our hosting provider\n\nAll providers are bound by their own privacy policies and applicable data protection law.` },
      { h: "6. Cookies", body: `We use essential cookies to keep you logged in and maintain your session. We do not use advertising cookies or third-party tracking cookies.` },
      { h: "7. Your Rights", body: `Under UK GDPR and applicable data protection law, you have the right to:\n\n• Access the personal data we hold about you\n• Correct inaccurate data\n• Request deletion of your data\n• Object to or restrict certain processing\n• Data portability\n\nTo exercise any of these rights, contact hello@reshmaoracle.com.` },
      { h: "8. Data Retention", body: `We retain your account data for as long as your account is active. If you delete your account, we will delete your personal data within 30 days, except where we are required by law to retain it.` },
      { h: "9. Security", body: `We take reasonable technical and organisational measures to protect your data. All data is transmitted over HTTPS. Payment data is handled exclusively by Stripe, which is PCI-DSS compliant.` },
      { h: "10. Changes to This Policy", body: `We may update this Privacy Policy from time to time. We will notify you of material changes by email or by a notice on the site.` },
    ]
  },
  refund: {
    title: "Refund Policy",
    updated: "22 July 2026",
    sections: [
      { h: "Monthly and Annual Subscriptions", body: `We offer a 7-day refund on your first payment for monthly or annual memberships. If you are not satisfied within 7 days of your first charge, contact us at hello@reshmaoracle.com and we will issue a full refund, no questions asked.\n\nAfter 7 days, subscription payments are non-refundable. You may cancel at any time to prevent future charges, and you retain access until the end of your current billing period.` },
      { h: "Lifetime Membership", body: `Lifetime membership purchases are non-refundable after 14 days. If you experience a technical issue preventing you from accessing the service, contact us within 14 days and we will either resolve the issue or issue a full refund at our discretion.` },
      { h: "Guidebooks and Digital Products", body: `Digital products (guidebooks purchased via Beacons) are non-refundable once downloaded. If you have a genuine issue with a product, contact us and we will review on a case-by-case basis.` },
      { h: "How to Request a Refund", body: `Email hello@reshmaoracle.com with:\n\n• Your email address used to subscribe\n• The date of purchase\n• A brief description of your reason (optional)\n\nWe aim to process all refund requests within 5 business days. Refunds are returned to the original payment method via Stripe.` },
      { h: "Chargebacks", body: `We ask that you contact us before initiating a chargeback. We are happy to resolve any genuine issue directly. Fraudulent chargebacks may result in account suspension.` },
      { h: "Contact", body: `hello@reshmaoracle.com` },
    ]
  }
};

export default function Legal({ page = "tos", onBack }) {
  const P = PAGES[page] || PAGES.tos;
  return (
    <div style={{ minHeight:"100vh", background:"#000", padding:"0 0 80px", fontFamily:"'Jost',sans-serif" }}>
      {/* Nav */}
      <div style={{ position:"sticky", top:0, background:"rgba(0,0,0,0.97)", borderBottom:"1px solid rgba(44,183,167,0.12)", padding:"16px 24px", display:"flex", alignItems:"center", gap:16, zIndex:100 }}>
        <button onClick={onBack} style={{ background:"none", border:"none", color:"#2CB7A7", cursor:"pointer", fontSize:14, fontFamily:"'Jost',sans-serif", padding:0 }}>← Back</button>
        <div style={{ display:"flex", gap:24, marginLeft:"auto" }}>
          {Object.entries(PAGES).map(([k,v])=>(
            <a key={k} href={`#${k}`} style={{ fontSize:12, color: page===k?"#2CB7A7":"#c8bfb8", textDecoration:"none", letterSpacing:"0.08em" }}>{v.title}</a>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth:720, margin:"0 auto", padding:"56px 24px 0" }}>
        <div style={{ fontSize:11, letterSpacing:"0.22em", textTransform:"uppercase", color:"#2CB7A7", marginBottom:16 }}>reshmaoracle.com</div>
        <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontSize:"clamp(36px,6vw,52px)", color:"#f2ece4", fontWeight:400, marginBottom:8, lineHeight:1.1 }}>{P.title}</h1>
        <p style={{ fontSize:13, color:"#c8bfb8", marginBottom:48 }}>Last updated: {P.updated}</p>
        {P.sections.map((s,i)=>(
          <div key={i} style={{ marginBottom:40 }}>
            <h2 style={{ fontSize:18, fontWeight:500, color:"#f2ece4", marginBottom:14, fontFamily:"'Jost',sans-serif" }}>{s.h}</h2>
            {s.body.split('\n').map((line,j)=>(
              <p key={j} style={{ fontSize:16, color:"#c8bfb8", lineHeight:1.85, marginBottom: line===''?8:0, fontFamily:"'Jost',sans-serif" }}>{line}</p>
            ))}
          </div>
        ))}
        <div style={{ marginTop:64, paddingTop:32, borderTop:"1px solid rgba(44,183,167,0.12)", fontSize:13, color:"#888", fontFamily:"'Jost',sans-serif" }}>
          © 2026 Reshma Oracle · All rights reserved · <a href="mailto:hello@reshmaoracle.com" style={{ color:"#2CB7A7" }}>hello@reshmaoracle.com</a>
        </div>
      </div>
    </div>
  );
}
