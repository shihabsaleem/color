/**
 * WCAG 2.1 Contrast Ratio Utilities
 * https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html
 */

export interface ContrastResult {
  ratio: number;
  ratioDisplay: string;
  aa_normal: boolean;   // 4.5:1 for normal text
  aa_large: boolean;    // 3:1 for large text (18pt / 14pt bold)
  aaa_normal: boolean;  // 7:1 for enhanced normal text
  aaa_large: boolean;   // 4.5:1 for enhanced large text
  grade: "AAA" | "AA" | "AA Large" | "Fail";
}

function relativeLuminance(r: number, g: number, b: number): number {
  const toLinear = (c: number) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

export function contrastRatio(
  fg: { r: number; g: number; b: number },
  bg: { r: number; g: number; b: number }
): ContrastResult {
  const l1 = relativeLuminance(fg.r, fg.g, fg.b);
  const l2 = relativeLuminance(bg.r, bg.g, bg.b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  const ratio = (lighter + 0.05) / (darker + 0.05);

  const aa_normal = ratio >= 4.5;
  const aa_large = ratio >= 3;
  const aaa_normal = ratio >= 7;
  const aaa_large = ratio >= 4.5;

  let grade: ContrastResult["grade"];
  if (aaa_normal) grade = "AAA";
  else if (aa_normal) grade = "AA";
  else if (aa_large) grade = "AA Large";
  else grade = "Fail";

  return {
    ratio,
    ratioDisplay: ratio.toFixed(2) + ":1",
    aa_normal,
    aa_large,
    aaa_normal,
    aaa_large,
    grade,
  };
}

export function gradeColor(grade: ContrastResult["grade"]): string {
  switch (grade) {
    case "AAA": return "#22c55e";
    case "AA": return "#84cc16";
    case "AA Large": return "#f59e0b";
    case "Fail": return "#ef4444";
  }
}
