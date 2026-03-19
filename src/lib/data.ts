import { HarmonyType, ColorSwatch, colorName } from "./colorUtils";

export const SITE_INFO = {
  name: " ",
  logoUrl: "/assets/logo.png",
};

export const SEO_DATA = {
  title: "color — Color Palette Generator",
  description: "Generate beautiful color palettes using HSL harmony, lock your brand colors, extract palettes from images, and check WCAG accessibility — all in one tool.",
  keywords: ["color palette", "color generator", "color harmony", "WCAG", "accessibility", "design tools"],
};

export const UI_STRINGS = {
  // Swatch Interaction
  copiedToast: "Copied!",
  copyHexTitle: "Copy Hex",
  editColorTitle: "Edit Color",
  lockTitle: "Lock",
  unlockTitle: "Unlock",
  
  // Dock Controls
  generateBtn: "Generate",
  
  // Modals & Actions
  imageToolTitle: "Image to Palette",
  wcagToolTitle: "WCAG Checker",
  exportToolTitle: "Export",

  // Image Extractor Tool
  imageModalTitle: "Image → Palette",
  extractingMsg: "Extracting colors safely...",
  dropImageMsg: "Drop an image here or click to browse",

  // WCAG Checker Tool
  wcagModalTitle: "WCAG Checker",
  textColorLabel: "Text Color",
  bgColorLabel: "Background",
  sampleText: "Sample Text",
  aaNormal: "AA Normal (4.5:1)",
  aaLarge: "AA Large (3:1)",
  passLabel: "Pass",
  failLabel: "Fail",

  // Export Tool
  exportModalTitle: "Export Palette",
  cssVarsLabel: "CSS Variables",
  copyBtn: "Copy",
  copiedBtn: "Copied!"
};

export const HARMONIES: { value: HarmonyType; label: string }[] = [
  { value: "complementary", label: "Complementary" },
  { value: "analogous", label: "Analogous" },
  { value: "triadic", label: "Triadic" },
  { value: "tetradic", label: "Tetradic" },
  { value: "split-complementary", label: "Split Complementary" },
  { value: "monochromatic", label: "Monochromatic" },
  { value: "square", label: "Square" },
  { value: "random", label: "Random" },
];

export const INITIAL_PALETTE: ColorSwatch[] = [
  { id: "swatch-0", hex: "#a78bfa", hsl: { h: 255, s: 92, l: 76 }, rgb: { r: 167, g: 139, b: 250 }, locked: false, name: colorName("#a78bfa") },
  { id: "swatch-1", hex: "#9595fb", hsl: { h: 240, s: 94, l: 78 }, rgb: { r: 149, g: 149, b: 251 }, locked: false, name: colorName("#9595fb") },
  { id: "swatch-2", hex: "#839ffc", hsl: { h: 226, s: 96, l: 75 }, rgb: { r: 131, g: 159, b: 252 }, locked: false, name: colorName("#839ffc") },
  { id: "swatch-3", hex: "#71a2fc", hsl: { h: 219, s: 96, l: 71 }, rgb: { r: 113, g: 162, b: 252 }, locked: false, name: colorName("#71a2fc") },
  { id: "swatch-4", hex: "#60a5fa", hsl: { h: 213, s: 94, l: 68 }, rgb: { r: 96, g: 165, b: 250 }, locked: false, name: colorName("#60a5fa") },
];
