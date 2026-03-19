"use client";
import Link from "next/link";
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { colorName } from "@/lib/colorUtils";

/* ─── Data ──────────────────────────────────────────────────────────────────── */

const PRESET_PALETTES = [
  { id: "1",  likes: "123K", name: "Ocean Dusk",   colors: ["#264653","#2a9d8f","#e9c46a","#f4a261","#e76f51"] },
  { id: "2",  likes: "98K",  name: "Warzone",      colors: ["#003049","#d62828","#f77f00","#fcbf49","#eae2b7"] },
  { id: "3",  likes: "84K",  name: "Sun & Sea",    colors: ["#8ecae6","#219ebc","#023047","#ffb703","#fb8500"] },
  { id: "4",  likes: "76K",  name: "Rose Blush",   colors: ["#ffcdb2","#ffb4a2","#e5989b","#b5838d","#6d6875"] },
  { id: "5",  likes: "72K",  name: "Cotton Candy", colors: ["#cdb4db","#ffc8dd","#ffafcc","#bde0fe","#a2d2ff"] },
  { id: "6",  likes: "65K",  name: "Wildfire",     colors: ["#f94144","#f3722c","#f8961e","#f9844a","#90be6d"] },
  { id: "7",  likes: "60K",  name: "Ember",        colors: ["#03071e","#370617","#6a040f","#9d0208","#d00000"] },
  { id: "8",  likes: "55K",  name: "Aquatica",     colors: ["#d9ed92","#b5e2fa","#90e0ef","#a2d2ff","#184e77"] },
  { id: "9",  likes: "50K",  name: "Plum Dusk",    colors: ["#355070","#6d597a","#b56576","#e56b6f","#eaac8b"] },
  { id: "10", likes: "45K",  name: "Contrast",     colors: ["#000000","#14213d","#fca311","#e5e5e5","#ffffff"] },
  { id: "11", likes: "42K",  name: "Off-Duty Red", colors: ["#2b2d42","#8d99ae","#edf2f4","#ef233c","#d90429"] },
  { id: "12", likes: "39K",  name: "Linen",        colors: ["#fefae0","#e9edc9","#ccd5ae","#d4a373","#faedcb"] },
];

/* ─── Helpers ───────────────────────────────────────────────────────────────── */

/** Returns true if hex colour is perceptually light (use dark text on it) */
function isLight(hex: string): boolean {
  const r = parseInt(hex.slice(1,3),16)/255;
  const g = parseInt(hex.slice(3,5),16)/255;
  const b = parseInt(hex.slice(5,7),16)/255;
  const lin = (c: number) => c <= 0.04045 ? c/12.92 : ((c+0.055)/1.055)**2.4;
  return 0.2126*lin(r) + 0.7152*lin(g) + 0.0722*lin(b) > 0.35;
}

function paletteUrl(colors: string[]) {
  return `/generator?colors=${colors.map(c => c.replace("#","")).join(",")}`;
}

/* ─── Card ──────────────────────────────────────────────────────────────────── */

function PaletteCard({ palette }: { palette: typeof PRESET_PALETTES[0] }) {
  const [copied, setCopied] = useState<string | null>(null);
  const [hovered, setHovered] = useState(false);

  const handleCopy = (e: React.MouseEvent, hex: string) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(hex);
    setCopied(hex);
    setTimeout(() => setCopied(null), 1400);
  };

  return (
    <Link
      href={paletteUrl(palette.colors)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative flex flex-col bg-white/[0.025] border border-white/[0.07] rounded-[18px] overflow-hidden no-underline text-inherit transition-[border-color,transform,box-shadow] duration-300 hover:border-white/[0.16] hover:-translate-y-1.5 hover:shadow-[0_24px_48px_rgba(0,0,0,0.5)]"
    >
      {/* ── Swatch strip ── */}
      <div className="flex w-full overflow-hidden" style={{ aspectRatio: "4/3" }}>
        {palette.colors.map((hex, i) => (
          <button
            key={i}
            onClick={(e) => handleCopy(e, hex)}
            title={hex}
            style={{ backgroundColor: hex }}   /* dynamic — must stay */
            className="flex-1 border-0 p-0 cursor-pointer flex items-end justify-center pb-2.5 transition-[flex] duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:flex-[1.8_1.8_0%]"
          >
            <span
              style={{ color: isLight(hex) ? "rgba(0,0,0,0.7)" : "rgba(255,255,255,0.85)" }}   /* dynamic — must stay */
              className="text-[9px] font-extrabold tracking-[0.08em] uppercase opacity-0 group-hover/swatch:opacity-100 transition-opacity duration-[180ms] whitespace-nowrap pointer-events-none leading-none"
            >
              {copied === hex ? "✓" : hex.toUpperCase()}
            </span>
          </button>
        ))}
      </div>

      {/* ── Card footer ── */}
      <div className="flex flex-col gap-2.5 px-4 pt-3.5 pb-4">
        <p className="text-[13px] font-bold text-white/75 tracking-tight leading-none">
          {palette.name}
        </p>

        <div className="flex items-center justify-between">
          {/* Colour dot strip */}
          <div className="flex gap-1">
            {palette.colors.slice(0,4).map((hex, i) => (
              <span
                key={i}
                style={{ backgroundColor: hex }}   /* dynamic — must stay */
                className="block w-3.5 h-3.5 rounded-full border border-white/[0.12] shrink-0"
              />
            ))}
          </div>

          {/* Like count */}
          <span className="flex items-center gap-1 text-[11px] font-bold tracking-[0.03em] text-white/25">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="shrink-0">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            {palette.likes}
          </span>
        </div>
      </div>

      {/* ── Hover pill ── */}
      <div
        className={`
          absolute top-3 right-3 pointer-events-none
          bg-[rgba(10,10,10,0.85)] backdrop-blur-md
          border border-white/[0.12] rounded-full
          px-2.5 py-1.5
          text-[11px] font-bold tracking-[0.02em] text-white/75
          transition-[opacity,transform] duration-200
          ${hovered ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"}
        `}
      >
        Open in generator →
      </div>
    </Link>
  );
}

/* ─── Page ──────────────────────────────────────────────────────────────────── */

export default function ShowcasePage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPalettes = PRESET_PALETTES.filter((p) => {
    const query = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(query) ||
      p.colors.some((c) => {
        const hex = c.toLowerCase();
        const des = colorName(c).toLowerCase();
        return hex.includes(query) || des.includes(query);
      })
    );
  });

  return (
    <div className="min-h-screen flex flex-col relative bg-[#0a0a0a]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Grain */}
      <div className="grain" aria-hidden="true" />

      {/* Ambient top glow — radial gradient can't be expressed as a Tailwind class */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-0"
        style={{ background: "radial-gradient(ellipse 70% 40% at 50% -5%, rgba(255,94,58,0.09) 0%, transparent 65%)" }}
      />

      <Navbar />

      {/* ── Main ── */}
      <main
        style={{
          padding: "64px clamp(24px, 6vw, 80px) 96px",
          flex: 1,
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: "1280px",
          margin: "0 auto",
        }}
      >

        {/* Header */}
        <header style={{ marginBottom: "3.5rem" }} className="fade-up-1">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-2xl">
              {/* Eyebrow row */}
              <div className="flex items-center gap-4" style={{ marginBottom: "1.75rem" }}>
                <span className="tag">
                  <span className="tag-dot" />
                  Community picks
                </span>
                <span className="text-[11px] font-bold tracking-[0.1em] uppercase text-white/20">
                  {PRESET_PALETTES.length} palettes
                </span>
              </div>

              {/* Title */}
              <h1
                className="font-black text-white leading-[0.95] tracking-[-0.04em]"
                style={{ fontSize: "clamp(3rem, 7vw, 6.5rem)", marginBottom: "1.5rem" }}
              >
                Trending
                <br />
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontStyle: "italic",
                    fontWeight: 700,
                    backgroundImage: "linear-gradient(100deg, #ff5e3a 0%, #ffce3a 100%)",
                  }}
                >
                  Palettes
                </span>
              </h1>

              <p className="text-[1.05rem] text-white/[0.38] leading-[1.7] max-w-[460px] font-normal">
                Get inspired by the community&apos;s most-loved colour combinations.
                Click any swatch to copy its hex.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="Search by name or hex..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "14px",
                  padding: "14px 20px",
                  color: "white",
                  fontSize: "14px",
                  outline: "none",
                  transition: "border-color 0.2s, background 0.2s",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
                  e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                }}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
            </div>
          </div>
        </header>

        {/* Palette grid */}
        {filteredPalettes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 fade-up-2">
            {filteredPalettes.map((p) => (
              <PaletteCard key={p.id} palette={p} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center fade-up-2">
            <p className="text-white/20 text-lg font-medium">No palettes found matching &quot;{searchQuery}&quot;</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}