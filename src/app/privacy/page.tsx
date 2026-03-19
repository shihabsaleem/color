import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col relative bg-[#0a0a0a]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Grain */}
      <div className="grain" aria-hidden="true" />

      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-0"
        style={{ background: "radial-gradient(ellipse 70% 40% at 50% -5%, rgba(58,255,178,0.04) 0%, transparent 65%)" }}
      />

      <Navbar />

      <main
        style={{
          padding: "80px clamp(24px, 6vw, 80px) 120px",
          flex: 1,
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        <header className="mb-16 fade-up-1">
          <h1 className="text-5xl font-black text-white mb-6 tracking-tight">Privacy Policy</h1>
          <p className="text-white/40 text-lg">Last updated: March 19, 2026</p>
        </header>

        <section className="fade-up-2 prose prose-invert max-w-none" style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.8 }}>
          <div className="space-y-12">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
              <p>
                We collect personal information that you provide to us when you register for an account or subscribe to our newsletter. This includes your name and email address.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-4">2. Cookies</h2>
              <p>
                We use cookies to improve your user experience and for analytics purposes. You can manage your cookie preferences in your browser settings.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-4">3. Data Security</h2>
              <p>
                We take the security of your data seriously and take steps to protect it from unauthorized access, disclosure, or destruction. We use industry-standard encryption and security protocols to safeguard your information.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-4">4. Third-Party Services</h2>
              <p>
                We may use third-party services to help us operate our personal and commercial use of the service. These services may collect information from you. You can find more information in our third-party services privacy policies.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-4">5. Your Choices</h2>
              <p>
                You have the right to access, correct, or delete your personal information. You can do this by contacting us at our website or through our support team.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-4">6. Contact Us</h2>
              <p>
                If you have any questions or concerns about our privacy policy, please contact us at our website or through our support team.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
