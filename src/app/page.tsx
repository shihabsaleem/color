import Link from "next/link";
import React from "react";
import { SITE_INFO } from "@/lib/data";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// ─── Palette data ─────────────────────────────────────────────────────────────

const HERO_SWATCHES = [
  { color: "#264653", label: "#264653", dark: true },
  { color: "#2a9d8f", label: "#2A9D8F", dark: true },
  { color: "#e9c46a", label: "#E9C46A", dark: false },
  { color: "#f4a261", label: "#F4A261", dark: false },
  { color: "#e76f51", label: "#E76F51", dark: true },
];

const MINI_PALETTES = [
  ["#03045e", "#0077b6", "#00b4d8", "#90e0ef", "#caf0f8"],
  ["#10002b", "#3c096c", "#7b2d8b", "#c77dff", "#e0aaff"],
  ["#1b1b2f", "#e94560", "#ffffff", "#f5a623", "#0f3460"],
];

const FEATURES = [
  {
    icon: "⚡",
    title: "Instant generation",
    desc: "Hit spacebar. Get a new palette. No loading, no friction — just flow.",
  },
  {
    icon: "♿",
    title: "WCAG compliance",
    desc: "Automatic contrast checking against AA and AAA standards. Ship accessible designs faster.",
  },
  {
    icon: "📦",
    title: "Export anywhere",
    desc: "CSS variables, Tailwind config, Figma tokens, JSON, or raw hex — your choice.",
  },
];

// Items duplicated inside JSX for a seamless -50% ticker loop
const TICKER_ITEMS = [
  "Generate palettes",
  "WCAG Contrast",
  "Export CSS",
  "Random palette",
  "Lock colors",
  "Gradient tool",
  "Color blindness simulator",
  "AI suggestions",
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      {/* Grain overlay */}
      <div className="grain" aria-hidden="true" />

      {/* Ambient glow */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          background:
            "radial-gradient(ellipse 80% 60% at 60% -10%, rgba(255,94,58,0.12) 0%, transparent 70%), " +
            "radial-gradient(ellipse 60% 50% at 10% 80%, rgba(58,255,178,0.07) 0%, transparent 70%)",
        }}
      />

      <Navbar />

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <main
        style={{
          position: "relative",
          zIndex: 1,
          padding: "56px clamp(32px, 6vw, 96px) 0",
          flex: 1,
        }}
      >
        {/*
          Ghost big number — parent has position:relative (set above via style),
          so this absolute child anchors to the hero section correctly.
        */}
        <div className="big-number" aria-hidden="true">
          4.5M
        </div>

        {/* Live tag */}
        <div className="fade-up-1" style={{ marginBottom: "2rem" }}>
          <span className="tag">
            <span className="tag-dot" />
            Live · 4.5M palettes generated
          </span>
        </div>

        {/* Headline */}
        <h1
          className="fade-up-2 mb-6"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 900,
            fontSize: "clamp(2.8rem, 7vw, 7rem)",
            lineHeight: 1.0,
            letterSpacing: "-0.03em",
            maxWidth: "900px",
          }}
        >
          Build beautiful
          <br />
          <span
            style={{
              fontFamily: "'Playfair Display', serif",
              fontStyle: "italic",
              fontWeight: 700,
              color: "transparent",
              backgroundImage: "linear-gradient(90deg, #ff5e3a, #ffce3a)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
            }}
          >
            color palettes
          </span>
          <br />
          in seconds.
        </h1>

        {/* Sub-heading */}
        <p
          className="fade-up-3"
          style={{
            fontSize: "1.15rem",
            color: "rgba(255,255,255,0.45)",
            maxWidth: "480px",
            lineHeight: 1.75,
            fontWeight: 400,
            marginBottom: "2.5rem",
          }}
        >
          Generate, explore, and export stunning palettes. WCAG contrast
          checking built in.
        </p>

        {/* CTAs */}
        <div className="fade-up-4 flex flex-wrap gap-3" style={{ marginBottom: "5rem" }}>
          <Link href="/generator" className="cta-primary">
            Start generating →
          </Link>
          <Link href="/palettes" className="cta-ghost">
            Explore palettes
          </Link>
        </div>

        {/* ── Palette showcase ──────────────────────────────────────────────── */}
        <div className="fade-up-5 w-full max-w-5xl mx-auto mb-0">
          {/* Main large swatch strip */}
          <div
            className="flex h-52 md:h-72 rounded-2xl overflow-hidden mb-3"
            style={{
              gap: "4px",
              boxShadow: "0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)",
            }}
          >
            {HERO_SWATCHES.map((s, i) => (
              <div
                key={i}
                className="palette-card"
                style={{ background: s.color }}
              >
                <span
                  style={{
                    position: "absolute",
                    bottom: "10px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    fontSize: "10px",
                    fontWeight: 800,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: s.dark ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.6)",
                    opacity: 0,           /* revealed via CSS .palette-card:hover */
                    transition: "opacity 0.2s",
                    whiteSpace: "nowrap",
                    pointerEvents: "none",
                  }}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          {/* Mini palette row */}
          <div className="flex gap-2">
            {MINI_PALETTES.map((row, ri) => (
              <div
                key={ri}
                className="flex flex-1 h-11 rounded-xl overflow-hidden"
                style={{ gap: "2px" }}
              >
                {row.map((c, ci) => (
                  <div
                    key={ci}
                    className="flex-1 swatch cursor-pointer"
                    style={{ background: c, borderRadius: "6px" }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* ── Ticker ──────────────────────────────────────────────────────────── */}
      <div
        style={{
          overflow: "hidden",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          padding: "14px 0",
          marginTop: "64px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/*
          .ticker-track animates translateX(0) → translateX(-50%).
          We render TICKER_ITEMS twice so the second copy is an exact
          visual clone of the first — when the first copy scrolls fully
          off-screen the second seamlessly takes its place.
        */}
        <div className="ticker-track">
          {[0, 1].map((copy) =>
            TICKER_ITEMS.map((text, i) => (
              <span
                key={`${copy}-${i}`}
                style={{
                  padding: "0 28px",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.22)",
                  whiteSpace: "nowrap",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "28px",
                }}
              >
                {text}
                <span style={{ color: "var(--accent)", fontSize: "10px" }}>✦</span>
              </span>
            ))
          )}
        </div>
      </div>

      {/* ── Features ────────────────────────────────────────────────────────── */}
      <section
        style={{
          position: "relative",
          zIndex: 1,
          padding: "80px clamp(32px, 6vw, 96px)",
        }}
      >
        <div style={{ marginBottom: "3rem" }}>
          <span className="tag" style={{ display: "inline-flex" }}>
            Why use this
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {FEATURES.map((f, i) => (
            <div key={i} className="feature-card">
              <div style={{ fontSize: "2rem", marginBottom: "14px", lineHeight: 1 }}>
                {f.icon}
              </div>
              <div
                style={{ fontWeight: 800, fontSize: "1.05rem", marginBottom: "8px", letterSpacing: "-0.01em" }}
              >
                {f.title}
              </div>
              <div
                style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.9rem", lineHeight: 1.7 }}
              >
                {f.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}