import type { ThemeColorTokens } from './themeTokens';

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const cleaned = hex.replace(/^#/, '');
  if (!/^[0-9a-fA-F]{3,8}$/.test(cleaned)) return null;
  let full: string;
  if (cleaned.length === 3) {
    full = cleaned[0] + cleaned[0] + cleaned[1] + cleaned[1] + cleaned[2] + cleaned[2];
  } else if (cleaned.length === 6 || cleaned.length === 8) {
    full = cleaned;
  } else {
    return null;
  }
  const num = parseInt(full.slice(0, 6), 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => Math.round(n).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function lighten(hex: string, amount: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const factor = amount / 100;
  return rgbToHex(
    rgb.r + (255 - rgb.r) * factor,
    rgb.g + (255 - rgb.g) * factor,
    rgb.b + (255 - rgb.b) * factor,
  );
}

export function darken(hex: string, amount: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const factor = amount / 100;
  return rgbToHex(
    rgb.r * (1 - factor),
    rgb.g * (1 - factor),
    rgb.b * (1 - factor),
  );
}

export function alpha(hex: string, opacity: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
}

function relativeLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  const srgb = [rgb.r, rgb.g, rgb.b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
}

export function contrastRatio(hex1: string, hex2: string): number {
  const l1 = relativeLuminance(hex1);
  const l2 = relativeLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export function isLight(hex: string): boolean {
  const rgb = hexToRgb(hex);
  if (!rgb) return true;
  return rgb.r * 0.299 + rgb.g * 0.587 + rgb.b * 0.114 > 150;
}

export function ensureContrast(fg: string, bg: string, minRatio = 4.5): string {
  const ratio = contrastRatio(fg, bg);
  if (ratio >= minRatio) return fg;
  const fgIsLight = isLight(fg);
  const bgIsLight = isLight(bg);
  const fgRgb = hexToRgb(fg);
  if (!fgRgb) return fg;
  if (fgIsLight === bgIsLight) {
    return fgIsLight ? darken(fg, 20) : lighten(fg, 20);
  }
  return ensureContrast(fgIsLight ? lighten(fg, 10) : darken(fg, 10), bg, minRatio);
}

export interface DerivedColors {
  muted: string;
  subtle: string;
  codeBg: string;
  selectionBg: string;
  linkHover: string;
  cardBorder: string;
  headingMuted: string;
}

export function deriveColors(colors: ThemeColorTokens): DerivedColors {
  const isDark = !isLight(colors.bg);
  return {
    muted: isDark ? alpha(colors.text, 0.65) : alpha(darken(colors.text, 15), 0.75),
    subtle: alpha(colors.border, 0.35),
    codeBg: alpha(isDark ? colors.text : colors.border, 0.1),
    selectionBg: alpha(colors.accent, 0.25),
    linkHover: darken(colors.accent, isDark ? 0 : 15) || lighten(colors.accent, 15),
    cardBorder: alpha(colors.border, 0.5),
    headingMuted: alpha(colors.heading, 0.65),
  };
}

export interface VariantDerivedColors {
  bg: string;
  border: string;
  text: string;
  heading: string;
}

export function deriveVariantColors(
  accent: string,
  bg: string,
): { tip: VariantDerivedColors; warning: VariantDerivedColors; example: VariantDerivedColors; info: VariantDerivedColors } {
  const isDarkBg = !isLight(bg);
  const accentIsLight = isLight(accent);

  const tip: VariantDerivedColors = {
    bg: isDarkBg ? alpha('#10b981', 0.12) : lighten('#10b981', 85),
    border: isDarkBg ? lighten('#10b981', 20) : '#10b981',
    text: isDarkBg ? lighten('#10b981', 70) : darken('#10b981', 30),
    heading: isDarkBg ? lighten('#10b981', 80) : darken('#10b981', 20),
  };

  const warning: VariantDerivedColors = {
    bg: isDarkBg ? alpha('#f59e0b', 0.12) : lighten('#f59e0b', 82),
    border: isDarkBg ? lighten('#f59e0b', 20) : '#f59e0b',
    text: isDarkBg ? lighten('#f59e0b', 70) : darken('#f59e0b', 35),
    heading: isDarkBg ? lighten('#f59e0b', 80) : darken('#f59e0b', 20),
  };

  const example: VariantDerivedColors = {
    bg: isDarkBg ? alpha('#94a3b8', 0.12) : lighten('#94a3b8', 80),
    border: isDarkBg ? lighten('#94a3b8', 20) : '#94a3b8',
    text: isDarkBg ? lighten('#94a3b8', 70) : darken('#64748b', 20),
    heading: isDarkBg ? lighten('#94a3b8', 80) : darken('#64748b', 15),
  };

  const info: VariantDerivedColors = {
    bg: isDarkBg ? alpha(accent, 0.1) : alpha(lighten(accent, 75), 0.6),
    border: isDarkBg ? lighten(accent, 30) : darken(accent, 10),
    text: isDarkBg ? lighten(accent, 70) : darken(accent, 25),
    heading: isDarkBg ? lighten(accent, 85) : darken(accent, 15),
  };

  return { tip, warning, example, info };
}
