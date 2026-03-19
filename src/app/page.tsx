"use client";
import React, { useState, useCallback, useRef, useEffect } from "react";
import { ColorSwatch, HarmonyType, generatePalette, hexToHsl, colorName, hslToRgb, rgbToHex, regeneratePalette, rgbToHsl } from "@/lib/colorUtils";
import { contrastRatio, gradeColor } from "@/lib/wcag";
import { kMeans, samplePixelsFromImageData } from "@/lib/kmeans";

// ─── Icons ───────────────────────────────────────────────────────────────────
const IconRefresh = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2v6h-6" /><path d="M3 12a9 9 0 0 1 15-6.7L21 8" /><path d="M3 22v-6h6" /><path d="M21 12a9 9 0 0 1-15 6.7L3 16" /></svg>;
const IconLock = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z" /><path d="M7 11V7a5 5 0 0 1 10 0v4" fill="none" stroke="currentColor" strokeWidth="2.5" /></svg>;
const IconUnlock = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 9.9-1" /></svg>;
const IconCopy = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>;
const IconImage = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>;
const IconExport = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>;
const IconEye = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>;
const IconClose = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>;
const IconSettings = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>;
const IconSearch = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;

import { HARMONIES, SITE_INFO, UI_STRINGS, INITIAL_PALETTE } from "@/lib/data";

function getTextColor(rgb: { r: number; g: number; b: number }) {
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminance > 0.6 ? "rgba(0,0,0,0.85)" : "rgba(255,255,255,0.95)";
}

function parseColor(input: string): string | null {
  const normalized = input.trim();
  if (!normalized) return null;
  if (/^#?([a-f\d]{3}|[a-f\d]{6})$/i.test(normalized)) {
     let hex = normalized.startsWith("#") ? normalized : "#" + normalized;
     if (hex.length === 4) {
        hex = "#" + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
     }
     return hex;
  }
  if (typeof document !== "undefined") {
    const testCanvas = document.createElement("canvas");
    const testCtx = testCanvas.getContext("2d");
    if (testCtx) {
        testCtx.fillStyle = "#123456";
        testCtx.fillStyle = normalized;
        if (testCtx.fillStyle !== "#123456") {
            return testCtx.fillStyle;
        }
        if (normalized.toLowerCase() === "#123456") return "#123456";
    }
  }
  return null;
}

// ─── Modal Wrappers ───────────────────────────────────────────────────────────
function Modal({ children, onClose, title }: { children: React.ReactNode; onClose: () => void; title: string }) {
  return (
    <div className="modal-overlay animate-fade" onClick={onClose}>
      <div
        className="glass-panel animate-slide-up"
        style={{ padding: "32px", width: "100%", maxWidth: 540, position: "relative" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="btn btn-icon" onClick={onClose} style={{ position: "absolute", top: 20, right: 20 }}>
          <IconClose />
        </button>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24, paddingRight: 32 }}>{title}</h2>
        {children}
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function Home() {
  const [harmony, setHarmony] = useState<HarmonyType>("complementary");
  const [swatches, setSwatches] = useState<ColorSwatch[]>(INITIAL_PALETTE);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [baseHex, setBaseHex] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [activeModal, setActiveModal] = useState<"image" | "wcag" | "export" | null>(null);

  const handleGenerate = useCallback(() => {
    // Clear baseHex to fall back to random generation
    setBaseHex("");
    setSearchQuery("");
    setSwatches((prev) => regeneratePalette(prev, harmony));
  }, [harmony]);

  const handleSearchSubmit = useCallback((e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery) {
       const parsed = parseColor(searchQuery);
       if (parsed) {
          setBaseHex(parsed);
          const hsl = hexToHsl(parsed);
          if (hsl) {
             setSwatches((prev) => generatePalette(harmony, prev.filter((s) => s.locked), hsl));
             return;
          }
       }
    }
    // if empty or invalid, clear and generate random
    setBaseHex("");
    setSearchQuery("");
    setSwatches((prev) => regeneratePalette(prev, harmony));
  }, [searchQuery, harmony]);

  const handleHarmonyChange = useCallback((h: HarmonyType) => {
    setHarmony(h);
    setSwatches((prev) => {
      if (baseHex) {
        const hsl = hexToHsl(baseHex);
        if (hsl) return generatePalette(h, prev.filter((s) => s.locked), hsl);
      }
      return regeneratePalette(prev, h);
    });
  }, [baseHex]);

  const handleToggleLock = useCallback((id: string) => {
    setSwatches((prev) => prev.map((s) => s.id === id ? { ...s, locked: !s.locked } : s));
  }, []);

  const handleCopy = useCallback((id: string, text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    });
  }, []);

  const handleColorChange = useCallback((id: string, hex: string) => {
    const hsl = hexToHsl(hex);
    if (!hsl) return;
    const { r, g, b } = hslToRgb(hsl.h, hsl.s, hsl.l);
    setSwatches((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, hex, hsl, rgb: { r, g, b }, locked: true, name: colorName(hex) }
          : s
      )
    );
  }, []);

  // Keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === "Space" && (e.target as HTMLElement).tagName !== "INPUT" && !activeModal) {
        e.preventDefault();
        handleGenerate();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleGenerate, activeModal]);

  return (
    <main style={{ width: "100%", height: "100%", display: "flex", position: "relative" }}>

      {/* 5-Column Full Screen Layout */}
      {swatches.map((swatch, i) => {
        const textColor = getTextColor(swatch.rgb);
        const isCopied = copiedId === swatch.id;

        return (
          <div
            key={swatch.id}
            className="swatch-col animate-fade"
            style={{ backgroundColor: swatch.hex, animationDelay: `${i * 0.05}s` }}
            onClick={() => handleCopy(swatch.id, swatch.hex)}
          >
            {/* Center Hover Controls */}
            <div className="swatch-controls" style={{ color: textColor }} onClick={(e) => e.stopPropagation()}>
              <button
                className="swatch-btn"
                onClick={(e) => { e.stopPropagation(); handleToggleLock(swatch.id); }}
                title={swatch.locked ? UI_STRINGS.unlockTitle : UI_STRINGS.lockTitle}
                style={{ color: textColor }}
              >
                {swatch.locked ? <IconLock /> : <IconUnlock />}
              </button>

              <button
                className="swatch-btn"
                onClick={(e) => { e.stopPropagation(); handleCopy(swatch.id, swatch.hex); }}
                title={UI_STRINGS.copyHexTitle}
                style={{ color: textColor }}
              >
                {isCopied ? <span style={{ fontSize: 18 }}>✓</span> : <IconCopy />}
              </button>

              <div style={{ position: "relative" }}>
                <button className="swatch-btn" title={UI_STRINGS.editColorTitle} style={{ color: textColor }}>
                  <IconSettings />
                </button>
                <input
                  type="color"
                  value={swatch.hex}
                  onChange={(e) => handleColorChange(swatch.id, e.target.value)}
                  style={{
                    position: "absolute", inset: 0, opacity: 0, cursor: "pointer", width: "100%", height: "100%"
                  }}
                />
              </div>
            </div>

            {/* Bottom Labels */}
            <div style={{ padding: "0 24px 32px", textAlign: "center", color: textColor, pointerEvents: "none" }}>
              <div style={{
                opacity: isCopied ? 1 : 0,
                transform: isCopied ? "translateY(-8px)" : "translateY(10px)",
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                fontWeight: 700,
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: 2,
                marginBottom: 8,
              }}>
                {UI_STRINGS.copiedToast}
              </div>
              <div className="swatch-hex">{swatch.hex.replace("#", "")}</div>
              <div className="swatch-name">{swatch.name}</div>
            </div>

            {/* Lock indicator strip if locked */}
            {swatch.locked && (
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: textColor, opacity: 0.3 }} />
            )}
          </div>
        );
      })}

      {/* Floating Dock Wrapper */}
      <div style={{ position: "fixed", bottom: 40, left: 0, right: 0, display: "flex", justifyContent: "center", pointerEvents: "none", zIndex: 50 }}>
        <div
          className="glass-panel animate-dock"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "16px 24px",
            width: "max-content",
            maxWidth: "calc(100vw - 32px)",
            flexWrap: "wrap",
            justifyContent: "center",
            pointerEvents: "auto",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginRight: 8, userSelect: "none" }}>
            <img src={SITE_INFO.logoUrl} alt="Logo" width={32} height={32} style={{ objectFit: "contain" }} />
          </div>

          <div style={{ width: 1, height: 32, background: "var(--border)", margin: "0 8px" }} />

          <form onSubmit={handleSearchSubmit} style={{ display: "flex", alignItems: "center", position: "relative" }}>
            <div style={{ position: "absolute", left: 10, color: "inherit", opacity: 0.5, pointerEvents: "none", display: "flex" }}>
               <IconSearch />
            </div>
            <input 
              type="text"
              placeholder="Search color..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input custom-input"
              style={{
                 padding: "8px 12px 8px 36px",
                 borderRadius: "var(--radius-md)",
                 border: "1px solid var(--border)",
                 background: "rgba(255,255,255,0.08)",
                 color: "inherit",
                 outline: "none",
                 width: "160px",
                 fontSize: "14px",
                 transition: "all 0.2s"
              }}
              onFocus={(e) => e.target.style.background = "rgba(255,255,255,0.12)"}
              onBlur={(e) => e.target.style.background = "rgba(255,255,255,0.08)"}
            />
          </form>

          <div style={{ width: 1, height: 32, background: "var(--border)", margin: "0 8px" }} />

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <select
              className="select custom-select"
              value={harmony}
              onChange={(e) => handleHarmonyChange(e.target.value as HarmonyType)}
            >
              {HARMONIES.map((h) => <option key={h.value} value={h.value}>{h.label}</option>)}
            </select>

            <button className="btn btn-primary" onClick={handleGenerate}>
              <IconRefresh /> {UI_STRINGS.generateBtn}
            </button>
          </div>

          <div style={{ width: 1, height: 32, background: "var(--border)", margin: "0 8px" }} />

          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <button className={`btn btn-icon ${activeModal === "image" ? "btn-primary" : ""}`} onClick={() => setActiveModal("image")} title={UI_STRINGS.imageToolTitle}>
              <IconImage />
            </button>
            <button className={`btn btn-icon ${activeModal === "wcag" ? "btn-primary" : ""}`} onClick={() => setActiveModal("wcag")} title={UI_STRINGS.wcagToolTitle}>
              <IconEye />
            </button>
            <button className={`btn btn-icon ${activeModal === "export" ? "btn-primary" : ""}`} onClick={() => setActiveModal("export")} title={UI_STRINGS.exportToolTitle}>
              <IconExport />
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {activeModal === "image" && (
        <Modal title={UI_STRINGS.imageModalTitle} onClose={() => setActiveModal(null)}>
          <ImageExtractor onExtract={(s) => { setSwatches(s); setActiveModal(null); }} />
        </Modal>
      )}

      {activeModal === "wcag" && (
        <Modal title={UI_STRINGS.wcagModalTitle} onClose={() => setActiveModal(null)}>
          <WCAGChecker swatches={swatches} />
        </Modal>
      )}

      {activeModal === "export" && (
        <Modal title={UI_STRINGS.exportModalTitle} onClose={() => setActiveModal(null)}>
          <ExportPanel swatches={swatches} />
        </Modal>
      )}

    </main>
  );
}

// ─── Modal Components ─────────────────────────────────────────────────────────

function ImageExtractor({ onExtract }: { onExtract: (swatches: ColorSwatch[]) => void }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const processImage = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setIsProcessing(true);
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const scale = Math.min(200 / img.width, 200 / img.height, 1);
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const clusters = kMeans(samplePixelsFromImageData(ctx.getImageData(0, 0, canvas.width, canvas.height), 3000), 5, 25);
      onExtract(clusters.slice(0, 5).map((c, i) => {
        const hex = rgbToHex(c.r, c.g, c.b);
        return { id: `swatch-${i}`, hsl: rgbToHsl(c.r, c.g, c.b), hex, rgb: c, locked: false, name: colorName(hex) };
      }));
    };
    img.src = url;
  };

  return (
    <div
      onClick={() => fileRef.current?.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) processImage(f); }}
      style={{
        border: "2px dashed var(--border)", borderRadius: "var(--radius-lg)", padding: 40,
        textAlign: "center", cursor: "pointer", background: "rgba(0,0,0,0.2)"
      }}
    >
      {isProcessing ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "center" }}>
          <IconRefresh /> <p>Extracting colors safely...</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center", opacity: 0.8 }}>
          <IconImage />
          <p>Drop an image here or click to browse</p>
        </div>
      )}
      <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) processImage(f); }} />
    </div>
  );
}

function WCAGChecker({ swatches }: { swatches: ColorSwatch[] }) {
  const [fgIdx, setFgIdx] = useState(0);
  const [bgIdx, setBgIdx] = useState(swatches.length > 1 ? 1 : 0);
  const fg = swatches[fgIdx], bg = swatches[bgIdx];
  const res = fg && bg ? contrastRatio(fg.rgb, bg.rgb) : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", gap: 16 }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
          <label style={{ fontSize: 12, opacity: 0.6 }}>{UI_STRINGS.textColorLabel}</label>
          <select className="select custom-select custom-select-wcag" value={fgIdx} onChange={(e) => setFgIdx(Number(e.target.value))}>
            {swatches.map((s, i) => <option key={s.id} value={i}>{s.hex.toUpperCase()}</option>)}
          </select>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
          <label style={{ fontSize: 12, opacity: 0.6 }}>Background</label>
          <select className="select" value={bgIdx} onChange={(e) => setBgIdx(Number(e.target.value))}>
            {swatches.map((s, i) => <option key={s.id} value={i}>{s.hex.toUpperCase()}</option>)}
          </select>
        </div>
      </div>

      {res && (
        <>
          <div style={{ background: bg.hex, padding: 24, borderRadius: "var(--radius-md)", textAlign: "center", transition: "all 0.3s" }}>
            <div style={{ color: fg.hex, fontSize: 32, fontWeight: 700, lineHeight: 1 }}>{res.ratioDisplay}</div>
            <div style={{ color: fg.hex, fontSize: 14, opacity: 0.8, marginTop: 8 }}>Sample Text ({res.grade})</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ padding: 12, background: "rgba(0,0,0,0.3)", borderRadius: "var(--radius-sm)", borderLeft: `3px solid ${res.aa_normal ? "#22c55e" : "#ef4444"}` }}>
              AA Normal (4.5:1) — {res.aa_normal ? "Pass" : "Fail"}
            </div>
            <div style={{ padding: 12, background: "rgba(0,0,0,0.3)", borderRadius: "var(--radius-sm)", borderLeft: `3px solid ${res.aa_large ? "#22c55e" : "#ef4444"}` }}>
              AA Large (3:1) — {res.aa_large ? "Pass" : "Fail"}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function ExportPanel({ swatches }: { swatches: ColorSwatch[] }) {
  const css = `:root {\n${swatches.map((s, i) => `  --color-${i + 1}: ${s.hex};`).join("\n")}\n}`;
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(css);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ fontSize: 14 }}>CSS Variables</h3>
        <button className="btn" onClick={handleCopy}>{copied ? "Copied!" : "Copy"}</button>
      </div>
      <pre style={{ background: "rgba(0,0,0,0.3)", padding: 16, borderRadius: "var(--radius-md)", fontSize: 13, fontFamily: "'JetBrains Mono', monospace", opacity: 0.9 }}>
        {css}
      </pre>
    </div>
  );
}
