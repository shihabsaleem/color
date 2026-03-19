// HSL-based color generation utilities
import nearestColor from "nearest-color";
import { colornames as colors } from "color-name-list";

const colorsMap = colors.reduce<{ [key: string]: string }>((o: { [key: string]: string }, { name, hex }: { name: string; hex: string }) => {
  o[name] = hex;
  return o;
}, {});
const nearest = nearestColor.from(colorsMap);

export interface HSLColor {
  h: number; // 0-360
  s: number; // 0-100
  l: number; // 0-100
}

export interface ColorSwatch {
  id: string;
  hsl: HSLColor;
  hex: string;
  rgb: { r: number; g: number; b: number };
  locked: boolean;
  name: string;
}

export type HarmonyType =
  | "complementary"
  | "analogous"
  | "triadic"
  | "tetradic"
  | "split-complementary"
  | "monochromatic"
  | "square"
  | "random";

// --- HSL <-> RGB <-> HEX conversions ---

export function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return {
    r: Math.round(f(0) * 255),
    g: Math.round(f(8) * 255),
    b: Math.round(f(4) * 255),
  };
}

export function rgbToHsl(r: number, g: number, b: number): HSLColor {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
    : null;
}

export function hexToHsl(hex: string): HSLColor | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  return rgbToHsl(rgb.r, rgb.g, rgb.b);
}

export function hslToHex(h: number, s: number, l: number): string {
  const { r, g, b } = hslToRgb(h, s, l);
  return rgbToHex(r, g, b);
}

// --- Harmony generation (all use HSL offsets) ---

function normalizeHue(h: number): number {
  return ((h % 360) + 360) % 360;
}

function makeSwatchFromHsl(h: number, s: number, l: number, id: string): Omit<ColorSwatch, "locked" | "name"> {
  h = normalizeHue(h);
  const hex = hslToHex(h, s, l);
  const rgb = hslToRgb(h, s, l);
  return { id, hsl: { h, s, l }, hex, rgb };
}

function generateHarmonyHues(base: HSLColor, type: HarmonyType): { h: number; s: number; l: number }[] {
  const { h, s, l } = base;

  switch (type) {
    case "complementary":
      return [
        { h, s, l },
        { h: h + 30, s: s * 0.85, l: Math.min(l + 10, 90) },
        { h: h + 180, s, l },
        { h: h + 180, s: s * 0.85, l: Math.max(l - 10, 15) },
        { h, s: s * 0.5, l: Math.min(l + 20, 92) },
      ];
    case "analogous":
      return [
        { h: h - 40, s, l },
        { h: h - 20, s, l },
        { h, s, l },
        { h: h + 20, s, l },
        { h: h + 40, s, l },
      ];
    case "triadic":
      return [
        { h, s, l },
        { h, s: s * 0.7, l: Math.min(l + 12, 88) },
        { h: h + 120, s, l },
        { h: h + 240, s, l },
        { h: h + 240, s: s * 0.7, l: Math.min(l + 12, 88) },
      ];
    case "tetradic":
      return [
        { h, s, l },
        { h: h + 90, s, l },
        { h: h + 180, s, l },
        { h: h + 270, s, l },
        { h, s: s * 0.5, l: Math.min(l + 18, 90) },
      ];
    case "split-complementary":
      return [
        { h, s, l },
        { h, s: s * 0.7, l: Math.min(l + 15, 90) },
        { h: h + 150, s, l },
        { h: h + 210, s, l },
        { h: h + 180, s: s * 0.5, l: Math.min(l + 20, 92) },
      ];
    case "monochromatic":
      return [
        { h, s, l: Math.max(l - 30, 10) },
        { h, s, l: Math.max(l - 15, 15) },
        { h, s, l },
        { h, s, l: Math.min(l + 15, 88) },
        { h, s, l: Math.min(l + 30, 93) },
      ];
    case "square":
      return [
        { h, s, l },
        { h: h + 90, s, l },
        { h: h + 180, s, l },
        { h: h + 270, s, l },
        { h, s: s * 0.4, l: Math.min(l + 22, 93) },
      ];
    case "random":
    default:
      return [
        { h, s, l },
        ...Array.from({ length: 4 }, () => ({
          h: Math.random() * 360,
          s: 30 + Math.random() * 60,
          l: 20 + Math.random() * 60,
        })),
      ];
  }
}

export function generatePalette(
  harmonyType: HarmonyType,
  lockedSwatches: ColorSwatch[],
  baseHsl?: HSLColor
): ColorSwatch[] {
  const base: HSLColor = baseHsl ?? {
    h: Math.random() * 360,
    s: 55 + Math.random() * 30,
    l: 40 + Math.random() * 20,
  };

  const harmonyColors = generateHarmonyHues(base, harmonyType);

  const swatches: ColorSwatch[] = harmonyColors.map((hsl, i) => {
    const id = `swatch-${i}`;
    const locked = lockedSwatches.find((s) => s.id === id);
    if (locked) return locked;
    const swatch = makeSwatchFromHsl(hsl.h, hsl.s, hsl.l, id);
    return { ...swatch, locked: false, name: colorName(swatch.hex) };
  });

  return swatches;
}

export function regeneratePalette(
  current: ColorSwatch[],
  harmonyType: HarmonyType
): ColorSwatch[] {
  const lockedSwatches = current.filter((s) => s.locked);
  if (lockedSwatches.length === current.length) return current;

  // Pick a base: first locked swatch, or a completely new random color
  const base = lockedSwatches[0]?.hsl ?? { 
    h: Math.random() * 360, 
    s: 55 + Math.random() * 30, // 55 to 85
    l: 40 + Math.random() * 20  // 40 to 60
  };

  const harmonyColors = generateHarmonyHues(base, harmonyType);

  // Filter out any generated colors that perfectly match our locked colors
  // so we don't unnecessarily place identical colors into unlocked swatches.
  const availableHues = harmonyColors.filter((hc) => 
    !lockedSwatches.some((ls) => 
      Math.abs(ls.hsl.h - hc.h) < 1 && 
      Math.abs(ls.hsl.s - hc.s) < 1 && 
      Math.abs(ls.hsl.l - hc.l) < 1
    )
  );

  return current.map((swatch) => {
    if (swatch.locked) return swatch;
    
    // Pick from available harmony colors, falling back to a random harmony mapping
    const hsl = availableHues.shift() ?? {
       h: Math.random() * 360,
       s: 40 + Math.random() * 40,
       l: 30 + Math.random() * 40,
    };
    
    const s = makeSwatchFromHsl(hsl.h, hsl.s, hsl.l, swatch.id);
    return { ...s, locked: false, name: colorName(s.hex) };
  });
}

// 100% accurate color naming based on color-name-list
export function colorName(hex: string): string {
  try {
    const match = nearest(hex) as { name: string } | null;
    return match ? match.name : "Unknown";
  } catch {
    return "Unknown";
  }
}
