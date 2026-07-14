export type ThemeCategory =
  | 'all'
  | 'light'
  | 'dark'
  | 'sepia'
  | 'colorful'
  | 'minimal'
  | 'literary'
  | 'press';

export interface ThemeColorTokens {
  bg: string;
  text: string;
  heading: string;
  border: string;
  quoteBg: string;
  quoteBorder: string;
  accent: string;
  infoBg: string;
  infoBorder: string;
}

export type TitleDecoration =
  | 'border-bottom'
  | 'underline'
  | 'double-border'
  | 'ornamental'
  | 'accent-line'
  | 'none';

export type TitleAlign = 'center' | 'left' | 'right';

export interface ThemeTitleTokens {
  weight?: 'normal' | 'bold' | '900';
  transform?: 'none' | 'uppercase' | 'capitalize';
  align?: TitleAlign;
  fontSize?: string;
  decoration?: TitleDecoration;
  borderWidth?: '1px' | '2px' | '3px';
  borderStyle?: 'solid' | 'dashed' | 'double';
  letterSpacing?: string;
  marginBottom?: string;
}

export type QuoteStyle =
  | 'left-bar'
  | 'full-box'
  | 'italic-only'
  | 'pull-quote'
  | 'bordered-box';

export interface ThemeQuoteTokens {
  style?: QuoteStyle;
  radius?: string;
  padded?: boolean;
  fontSize?: string;
  padding?: string;
  align?: 'left' | 'center' | 'right';
  fontStyle?: 'italic' | 'normal';
}

export interface ThemeInfoBoxTokens {
  radius?: string;
  shadow?: string;
  borderStyle?: 'solid' | 'dashed' | 'double' | 'accent-left';
  titleTransform?: 'none' | 'uppercase';
  titleLetterSpacing?: string;
  titleColor?: string;
  padding?: string;
}

export type DropCapStyle =
  | 'classic'
  | 'boxed'
  | 'minimal'
  | 'ornate'
  | 'glow'
  | 'none';

export interface ThemeDropCapTokens {
  size?: string;
  lineHeight?: string;
  style?: DropCapStyle;
  marginRight?: string;
}

export type HrStyle =
  | 'solid'
  | 'dashed'
  | 'dotted'
  | 'decorative'
  | 'double'
  | 'accent-wide';

export interface ThemeHrTokens {
  style?: HrStyle;
  width?: string;
  margin?: string;
}

export interface ThemeBodyTokens {
  maxWidth?: string;
  padding?: string;
  fontSize?: string;
  letterSpacing?: string;
}

export interface ThemeLinkTokens {
  underline?: boolean;
  color?: string;
  decorationStyle?: 'solid' | 'dashed' | 'dotted';
}

export interface ThemeCodeTokens {
  bgOpacity?: number;
  borderRadius?: string;
  border?: string;
  accentBorder?: boolean;
}

export type TableStyleId =
  | 'table-simple'
  | 'table-striped'
  | 'table-bordered'
  | 'table-header-accent'
  | 'table-minimal'
  | 'table-card';

export interface ThemeTableTokens {
  style: TableStyleId;
  headerBg?: string;
  headerText?: string;
  borderColor?: string;
  stripeBg?: string;
  radius?: string;
  cellPadding?: string;
  fontSize?: string;
}

export type FigureStyleId = 'plain' | 'ruled' | 'shadow' | 'polaroid';

export interface ThemeFigureTokens {
  style: FigureStyleId;
  captionAlign?: 'left' | 'center' | 'right';
  captionSize?: string;
  captionColor?: string;
  imageRadius?: string;
}

export interface ThemeTokens {
  id: string;
  name: string;
  category: Exclude<ThemeCategory, 'all'>;
  preview: { bg: string; text: string; accent: string };
  fonts: { body: string };
  lineHeight?: number;
  colors: ThemeColorTokens;
  body?: ThemeBodyTokens;
  title?: ThemeTitleTokens;
  quote?: ThemeQuoteTokens;
  infoBox?: ThemeInfoBoxTokens;
  dropCap?: ThemeDropCapTokens;
  hr?: ThemeHrTokens;
  links?: ThemeLinkTokens;
  code?: ThemeCodeTokens;
  table?: ThemeTableTokens;
  figure?: ThemeFigureTokens;
  /** @deprecated use dropCap.size */
  dropCapSize?: string;
  /** @deprecated use dropCap.lineHeight */
  dropCapLineHeight?: string;
  /** @deprecated use hr.style */
  hrStyle?: HrStyle;
}

export const THEME_TOKEN_LIST: ThemeTokens[] = [
  // --- 기존 4종 ---
  {
    id: 'theme-classic',
    name: '클래식 세피아',
    category: 'sepia',
    preview: { bg: '#fbf0d9', text: '#5f4b32', accent: '#8c7b64' },
    fonts: { body: "'Georgia', serif" },
    lineHeight: 1.8,
    colors: {
      bg: '#fbf0d9',
      text: '#5f4b32',
      heading: '#4a3623',
      border: '#d4c5b0',
      quoteBg: '#f2e2c4',
      quoteBorder: '#8c7b64',
      accent: '#8c7b64',
      infoBg: '#f2e2c4',
      infoBorder: '#8c7b64',
    },
    body: { maxWidth: '720px', padding: '2.5em 2em', fontSize: '1.05em' },
    title: {
      weight: 'normal',
      align: 'center',
      decoration: 'ornamental',
      fontSize: '2em',
      letterSpacing: '0.03em',
    },
    quote: { style: 'left-bar', radius: '0 8px 8px 0', padded: true },
    dropCap: { style: 'classic', size: '3.8em', lineHeight: '0.75' },
    infoBox: {
      radius: '4px',
      shadow: '0 2px 4px rgba(0,0,0,0.05)',
      borderStyle: 'accent-left',
      titleTransform: 'uppercase',
      titleLetterSpacing: '0.05em',
    },
    hr: { style: 'decorative' },
    links: { decorationStyle: 'solid' },
  },
  {
    id: 'theme-midnight',
    name: '미드나잇',
    category: 'dark',
    preview: { bg: '#121212', text: '#e0e0e0', accent: '#818cf8' },
    fonts: { body: "'Helvetica Neue', Helvetica, Arial, sans-serif" },
    lineHeight: 1.7,
    colors: {
      bg: '#121212',
      text: '#e0e0e0',
      heading: '#ffffff',
      border: '#333333',
      quoteBg: '#1e1e1e',
      quoteBorder: '#4f46e5',
      accent: '#818cf8',
      infoBg: '#1e1e1e',
      infoBorder: '#4f46e5',
    },
    body: { maxWidth: '780px', padding: '1.75em 2em', letterSpacing: '-0.01em' },
    title: {
      weight: 'bold',
      align: 'left',
      decoration: 'accent-line',
      fontSize: '1.6em',
      transform: 'uppercase',
      letterSpacing: '0.08em',
    },
    quote: { style: 'full-box', radius: '8px', padded: true },
    dropCap: { style: 'glow', size: '3.2em', lineHeight: '0.85' },
    infoBox: {
      borderStyle: 'solid',
      shadow: '0 0 20px rgba(129,140,248,0.15)',
      titleTransform: 'uppercase',
      titleLetterSpacing: '0.05em',
      titleColor: '#818cf8',
    },
    hr: { style: 'accent-wide' },
    links: { underline: false },
    code: { bgOpacity: 0.12, accentBorder: true },
  },
  {
    id: 'theme-modern',
    name: '모던 세리프',
    category: 'literary',
    preview: { bg: '#ffffff', text: '#111827', accent: '#111827' },
    fonts: { body: "'Merriweather', serif" },
    lineHeight: 1.9,
    colors: {
      bg: '#ffffff',
      text: '#111827',
      heading: '#111827',
      border: '#111827',
      quoteBg: 'transparent',
      quoteBorder: '#111827',
      accent: '#111827',
      infoBg: '#f9fafb',
      infoBorder: '#e5e7eb',
    },
    body: { maxWidth: '680px', padding: '3em 2.5em', fontSize: '1.02em' },
    title: {
      weight: 'bold',
      transform: 'uppercase',
      align: 'center',
      decoration: 'double-border',
      borderWidth: '2px',
      letterSpacing: '0.1em',
      fontSize: '1.5em',
    },
    quote: { style: 'italic-only', fontSize: '1.1em' },
    dropCap: { style: 'ornate', size: '3.8em', lineHeight: '0.7' },
    infoBox: { shadow: '4px 4px 0 #111827', borderStyle: 'solid' },
    hr: { style: 'solid', width: '2px' },
    links: { underline: true, decorationStyle: 'solid' },
    code: { border: '1px solid #e5e7eb' },
  },
  {
    id: 'theme-comfort',
    name: '편안한 독서',
    category: 'light',
    preview: { bg: '#f0fdf4', text: '#064e3b', accent: '#059669' },
    fonts: { body: "'Verdana', sans-serif" },
    lineHeight: 1.8,
    colors: {
      bg: '#f0fdf4',
      text: '#064e3b',
      heading: '#065f46',
      border: '#6ee7b7',
      quoteBg: '#d1fae5',
      quoteBorder: '#10b981',
      accent: '#059669',
      infoBg: '#d1fae5',
      infoBorder: '#10b981',
    },
    body: { maxWidth: '820px', padding: '2.5em 2.5em' },
    title: {
      weight: 'bold',
      align: 'left',
      decoration: 'border-bottom',
      borderStyle: 'dashed',
      fontSize: '1.7em',
    },
    quote: { style: 'full-box', radius: '12px', padded: true },
    dropCap: { style: 'boxed', size: '3em', lineHeight: '0.85' },
    infoBox: { radius: '12px', borderStyle: 'dashed', shadow: '0 4px 12px rgba(5,150,105,0.1)' },
    hr: { style: 'dashed' },
    links: { decorationStyle: 'dashed' },
  },
  // --- light ---
  {
    id: 'theme-paper-white',
    name: '순백 종이',
    category: 'light',
    preview: { bg: '#ffffff', text: '#1f2937', accent: '#3b82f6' },
    fonts: { body: "'Noto Serif KR', 'Georgia', serif" },
    lineHeight: 1.85,
    colors: {
      bg: '#ffffff',
      text: '#1f2937',
      heading: '#111827',
      border: '#e5e7eb',
      quoteBg: '#f3f4f6',
      quoteBorder: '#3b82f6',
      accent: '#3b82f6',
      infoBg: '#eff6ff',
      infoBorder: '#3b82f6',
    },
    body: { maxWidth: '760px', padding: '3em 2.5em', fontSize: '1.02em', letterSpacing: '0.01em' },
    title: {
      weight: 'normal',
      align: 'center',
      decoration: 'underline',
      fontSize: '1.9em',
      letterSpacing: '0.02em',
    },
    quote: { style: 'left-bar', radius: '0 6px 6px 0', padded: true },
    dropCap: { style: 'minimal', size: '3.2em' },
    infoBox: { radius: '6px', borderStyle: 'solid', shadow: '0 1px 3px rgba(0,0,0,0.06)' },
    hr: { style: 'solid' },
    links: { color: '#2563eb' },
  },
  {
    id: 'theme-snow',
    name: '눈밭',
    category: 'light',
    preview: { bg: '#f8fafc', text: '#334155', accent: '#64748b' },
    fonts: { body: "'Source Serif 4', 'Times New Roman', serif" },
    lineHeight: 1.9,
    colors: {
      bg: '#f8fafc',
      text: '#334155',
      heading: '#0f172a',
      border: '#cbd5e1',
      quoteBg: '#f1f5f9',
      quoteBorder: '#94a3b8',
      accent: '#64748b',
      infoBg: '#f1f5f9',
      infoBorder: '#94a3b8',
    },
    body: { maxWidth: '700px', padding: '3em 2em' },
    title: {
      weight: 'normal',
      align: 'center',
      decoration: 'none',
      fontSize: '2.1em',
      letterSpacing: '0.04em',
    },
    quote: { style: 'pull-quote', fontSize: '1.12em', radius: '0' },
    dropCap: { style: 'classic', size: '3.6em', lineHeight: '0.78' },
    infoBox: { radius: '0', borderStyle: 'double', padding: '1.25em' },
    hr: { style: 'dotted' },
    links: { underline: false },
  },
  {
    id: 'theme-slate-light',
    name: '슬레이트 라이트',
    category: 'light',
    preview: { bg: '#f1f5f9', text: '#475569', accent: '#0ea5e9' },
    fonts: { body: "'Inter', 'Segoe UI', sans-serif" },
    lineHeight: 1.75,
    colors: {
      bg: '#f1f5f9',
      text: '#475569',
      heading: '#1e293b',
      border: '#94a3b8',
      quoteBg: '#e2e8f0',
      quoteBorder: '#0ea5e9',
      accent: '#0ea5e9',
      infoBg: '#e0f2fe',
      infoBorder: '#0ea5e9',
    },
    body: { maxWidth: '900px', padding: '2em 3em', letterSpacing: '-0.015em' },
    title: {
      weight: '900',
      align: 'left',
      decoration: 'border-bottom',
      borderWidth: '3px',
      fontSize: '1.5em',
      transform: 'uppercase',
      letterSpacing: '0.12em',
    },
    quote: { style: 'italic-only', fontStyle: 'italic', padding: '0.5em 0 0.5em 1.25em' },
    dropCap: { style: 'none' },
    infoBox: { radius: '2px', borderStyle: 'accent-left', titleTransform: 'uppercase', titleLetterSpacing: '0.08em' },
    hr: { style: 'solid', width: '2px' },
    code: { bgOpacity: 0.04, borderRadius: '2px' },
  },
  {
    id: 'theme-sky-morning',
    name: '아침 하늘',
    category: 'light',
    preview: { bg: '#ecfeff', text: '#164e63', accent: '#06b6d4' },
    fonts: { body: "'Nunito', 'Verdana', sans-serif" },
    lineHeight: 1.85,
    colors: {
      bg: '#ecfeff',
      text: '#164e63',
      heading: '#0e7490',
      border: '#67e8f9',
      quoteBg: '#cffafe',
      quoteBorder: '#06b6d4',
      accent: '#06b6d4',
      infoBg: '#cffafe',
      infoBorder: '#06b6d4',
    },
    body: { maxWidth: '800px', padding: '2.75em 2.25em' },
    title: {
      weight: 'bold',
      align: 'center',
      decoration: 'accent-line',
      fontSize: '1.75em',
      transform: 'capitalize',
    },
    quote: { style: 'full-box', radius: '16px', padded: true, align: 'center' },
    dropCap: { style: 'boxed', size: '3.4em', lineHeight: '0.8' },
    infoBox: { radius: '16px', shadow: '0 6px 16px rgba(6,182,212,0.12)', borderStyle: 'solid' },
    hr: { style: 'accent-wide' },
    links: { decorationStyle: 'dotted' },
  },
  // --- dark ---
  {
    id: 'theme-oled',
    name: 'OLED 블랙',
    category: 'dark',
    preview: { bg: '#000000', text: '#d4d4d4', accent: '#a3a3a3' },
    fonts: { body: "'SF Pro Text', 'Segoe UI', sans-serif" },
    lineHeight: 1.65,
    colors: {
      bg: '#000000',
      text: '#d4d4d4',
      heading: '#ffffff',
      border: '#262626',
      quoteBg: '#0a0a0a',
      quoteBorder: '#525252',
      accent: '#a3a3a3',
      infoBg: '#171717',
      infoBorder: '#525252',
    },
    body: { maxWidth: '860px', padding: '1.5em 2em', letterSpacing: '-0.02em' },
    title: {
      weight: 'bold',
      align: 'left',
      decoration: 'none',
      fontSize: '1.4em',
      letterSpacing: '-0.02em',
    },
    quote: { style: 'italic-only', fontStyle: 'italic', padding: '0 0 0 1.25em' },
    dropCap: { style: 'minimal', size: '2.8em', lineHeight: '0.9' },
    infoBox: { radius: '0', borderStyle: 'solid', padding: '1.25em' },
    hr: { style: 'solid', width: '1px', margin: '2.5em 0' },
    links: { underline: false, color: '#e5e5e5' },
    code: { bgOpacity: 0.2, borderRadius: '0' },
  },
  {
    id: 'theme-navy-night',
    name: '네이비 나이트',
    category: 'dark',
    preview: { bg: '#0f172a', text: '#cbd5e1', accent: '#38bdf8' },
    fonts: { body: "'Libre Baskerville', 'Georgia', serif" },
    lineHeight: 1.8,
    colors: {
      bg: '#0f172a',
      text: '#cbd5e1',
      heading: '#f1f5f9',
      border: '#1e3a5f',
      quoteBg: '#1e293b',
      quoteBorder: '#38bdf8',
      accent: '#38bdf8',
      infoBg: '#1e293b',
      infoBorder: '#38bdf8',
    },
    body: { maxWidth: '740px', padding: '2.5em 2em' },
    title: {
      weight: 'normal',
      align: 'center',
      decoration: 'ornamental',
      fontSize: '1.85em',
      letterSpacing: '0.05em',
    },
    quote: { style: 'pull-quote', fontSize: '1.1em', radius: '4px' },
    dropCap: { style: 'glow', size: '3.5em', lineHeight: '0.78' },
    infoBox: {
      borderStyle: 'double',
      shadow: '0 0 24px rgba(56,189,248,0.12)',
      titleColor: '#38bdf8',
      titleTransform: 'uppercase',
      titleLetterSpacing: '0.06em',
    },
    hr: { style: 'decorative' },
    links: { color: '#38bdf8', decorationStyle: 'dotted' },
  },
  {
    id: 'theme-warm-charcoal',
    name: '따뜻한 차콜',
    category: 'dark',
    preview: { bg: '#292524', text: '#e7e5e4', accent: '#f59e0b' },
    fonts: { body: "'Lora', 'Georgia', serif" },
    lineHeight: 1.85,
    colors: {
      bg: '#292524',
      text: '#e7e5e4',
      heading: '#fafaf9',
      border: '#44403c',
      quoteBg: '#1c1917',
      quoteBorder: '#f59e0b',
      accent: '#f59e0b',
      infoBg: '#1c1917',
      infoBorder: '#f59e0b',
    },
    body: { maxWidth: '720px', padding: '2.25em 2em', fontSize: '1.03em' },
    title: {
      weight: 'normal',
      align: 'center',
      decoration: 'underline',
      fontSize: '1.9em',
      letterSpacing: '0.03em',
    },
    quote: { style: 'left-bar', radius: '0 10px 10px 0', padded: true },
    dropCap: { style: 'classic', size: '3.7em', lineHeight: '0.76' },
    infoBox: {
      radius: '8px',
      borderStyle: 'dashed',
      shadow: '0 4px 12px rgba(245,158,11,0.1)',
      titleColor: '#fbbf24',
    },
    hr: { style: 'dashed' },
    links: { color: '#fbbf24' },
  },
  {
    id: 'theme-forest-dark',
    name: '숲속 어둠',
    category: 'dark',
    preview: { bg: '#14532d', text: '#d1fae5', accent: '#4ade80' },
    fonts: { body: "'Merriweather', serif" },
    lineHeight: 1.9,
    colors: {
      bg: '#14532d',
      text: '#d1fae5',
      heading: '#ecfdf5',
      border: '#166534',
      quoteBg: '#052e16',
      quoteBorder: '#4ade80',
      accent: '#4ade80',
      infoBg: '#052e16',
      infoBorder: '#4ade80',
    },
    body: { maxWidth: '700px', padding: '2.5em 2em' },
    title: {
      weight: 'bold',
      align: 'center',
      decoration: 'double-border',
      borderWidth: '2px',
      fontSize: '1.7em',
      transform: 'capitalize',
    },
    quote: { style: 'bordered-box', radius: '8px', padded: true },
    dropCap: { style: 'ornate', size: '3.6em', lineHeight: '0.75' },
    infoBox: {
      radius: '6px',
      borderStyle: 'accent-left',
      shadow: '0 0 16px rgba(74,222,128,0.15)',
      titleColor: '#4ade80',
      titleTransform: 'uppercase',
    },
    hr: { style: 'double' },
    code: { bgOpacity: 0.15, accentBorder: true },
  },
  // --- sepia ---
  {
    id: 'theme-antique',
    name: '앤티크 양피지',
    category: 'sepia',
    preview: { bg: '#f5e6c8', text: '#5c4033', accent: '#8b6914' },
    fonts: { body: "'Palatino Linotype', 'Book Antiqua', serif" },
    lineHeight: 1.85,
    colors: {
      bg: '#f5e6c8',
      text: '#5c4033',
      heading: '#3d2914',
      border: '#c4a574',
      quoteBg: '#ede0c4',
      quoteBorder: '#8b6914',
      accent: '#8b6914',
      infoBg: '#ede0c4',
      infoBorder: '#8b6914',
    },
    body: { maxWidth: '680px', padding: '2.75em 2em', fontSize: '1.06em' },
    title: {
      weight: 'normal',
      align: 'center',
      decoration: 'ornamental',
      fontSize: '2em',
      letterSpacing: '0.06em',
    },
    quote: { style: 'left-bar', radius: '0 6px 6px 0', padded: true, fontSize: '1.05em' },
    dropCap: { style: 'ornate', size: '4em', lineHeight: '0.72' },
    infoBox: { radius: '0', borderStyle: 'double', titleTransform: 'uppercase', titleLetterSpacing: '0.04em' },
    hr: { style: 'decorative' },
  },
  {
    id: 'theme-old-book',
    name: '오래된 책',
    category: 'sepia',
    preview: { bg: '#e8d5b5', text: '#4a3728', accent: '#7c5c3e' },
    fonts: { body: "'Garamond', 'Times New Roman', serif" },
    lineHeight: 1.9,
    colors: {
      bg: '#e8d5b5',
      text: '#4a3728',
      heading: '#2d1f14',
      border: '#b8956a',
      quoteBg: '#dcc9a8',
      quoteBorder: '#7c5c3e',
      accent: '#7c5c3e',
      infoBg: '#dcc9a8',
      infoBorder: '#7c5c3e',
    },
    body: { maxWidth: '700px', padding: '2.5em 1.75em' },
    title: {
      weight: 'bold',
      align: 'center',
      decoration: 'border-bottom',
      borderStyle: 'dashed',
      fontSize: '1.75em',
    },
    quote: { style: 'italic-only', fontSize: '1.08em' },
    dropCap: { style: 'classic', size: '4.2em', lineHeight: '0.7', marginRight: '0.15em' },
    infoBox: { borderStyle: 'dashed', radius: '2px' },
    hr: { style: 'dashed' },
  },
  {
    id: 'theme-cafe-latte',
    name: '카페 라떼',
    category: 'sepia',
    preview: { bg: '#f3e8dc', text: '#5d4037', accent: '#a1887f' },
    fonts: { body: "'Cormorant Garamond', 'Georgia', serif" },
    lineHeight: 1.9,
    colors: {
      bg: '#f3e8dc',
      text: '#5d4037',
      heading: '#3e2723',
      border: '#bcaaa4',
      quoteBg: '#efebe9',
      quoteBorder: '#a1887f',
      accent: '#a1887f',
      infoBg: '#efebe9',
      infoBorder: '#a1887f',
    },
    body: { maxWidth: '750px', padding: '3em 2.5em', fontSize: '1.08em' },
    title: {
      weight: 'normal',
      align: 'center',
      decoration: 'accent-line',
      fontSize: '2.2em',
      letterSpacing: '0.02em',
    },
    quote: { style: 'pull-quote', radius: '12px', fontSize: '1.15em' },
    dropCap: { style: 'boxed', size: '3.5em', lineHeight: '0.78' },
    infoBox: { radius: '12px', shadow: '0 3px 10px rgba(93,64,55,0.08)', borderStyle: 'solid' },
    hr: { style: 'dotted' },
    links: { decorationStyle: 'dotted' },
  },
  // --- colorful ---
  {
    id: 'theme-rose',
    name: '로즈 가든',
    category: 'colorful',
    preview: { bg: '#fff1f2', text: '#881337', accent: '#f43f5e' },
    fonts: { body: "'Playfair Display', 'Georgia', serif" },
    lineHeight: 1.85,
    colors: {
      bg: '#fff1f2',
      text: '#881337',
      heading: '#9f1239',
      border: '#fda4af',
      quoteBg: '#ffe4e6',
      quoteBorder: '#f43f5e',
      accent: '#f43f5e',
      infoBg: '#ffe4e6',
      infoBorder: '#f43f5e',
    },
    body: { maxWidth: '760px', padding: '2.5em 2em' },
    title: {
      weight: 'normal',
      align: 'center',
      decoration: 'underline',
      fontSize: '2em',
      letterSpacing: '0.04em',
    },
    quote: { style: 'full-box', radius: '20px', padded: true, align: 'center' },
    dropCap: { style: 'boxed', size: '3.6em', lineHeight: '0.8' },
    infoBox: { radius: '20px', shadow: '0 8px 20px rgba(244,63,94,0.12)', borderStyle: 'solid' },
    hr: { style: 'accent-wide' },
    links: { color: '#e11d48' },
  },
  {
    id: 'theme-ocean',
    name: '오션 브리즈',
    category: 'colorful',
    preview: { bg: '#eff6ff', text: '#1e3a8a', accent: '#2563eb' },
    fonts: { body: "'Open Sans', sans-serif" },
    lineHeight: 1.8,
    colors: {
      bg: '#eff6ff',
      text: '#1e3a8a',
      heading: '#1d4ed8',
      border: '#93c5fd',
      quoteBg: '#dbeafe',
      quoteBorder: '#2563eb',
      accent: '#2563eb',
      infoBg: '#dbeafe',
      infoBorder: '#2563eb',
    },
    body: { maxWidth: '880px', padding: '2em 2.5em' },
    title: {
      weight: 'bold',
      align: 'left',
      decoration: 'border-bottom',
      borderWidth: '3px',
      fontSize: '1.6em',
      transform: 'uppercase',
      letterSpacing: '0.06em',
    },
    quote: { style: 'left-bar', radius: '0 12px 12px 0', padded: true },
    dropCap: { style: 'classic', size: '3.3em' },
    infoBox: { radius: '8px', borderStyle: 'accent-left', shadow: '0 4px 14px rgba(37,99,235,0.1)' },
    hr: { style: 'solid', width: '2px' },
    code: { accentBorder: true },
  },
  {
    id: 'theme-lavender',
    name: '라벤더 드림',
    category: 'colorful',
    preview: { bg: '#f5f3ff', text: '#4c1d95', accent: '#8b5cf6' },
    fonts: { body: "'Crimson Pro', serif" },
    lineHeight: 1.9,
    colors: {
      bg: '#f5f3ff',
      text: '#4c1d95',
      heading: '#5b21b6',
      border: '#c4b5fd',
      quoteBg: '#ede9fe',
      quoteBorder: '#8b5cf6',
      accent: '#8b5cf6',
      infoBg: '#ede9fe',
      infoBorder: '#8b5cf6',
    },
    body: { maxWidth: '720px', padding: '2.75em 2em', fontSize: '1.04em' },
    title: {
      weight: 'normal',
      align: 'center',
      decoration: 'ornamental',
      fontSize: '1.95em',
      letterSpacing: '0.05em',
    },
    quote: { style: 'pull-quote', radius: '24px', fontSize: '1.12em' },
    dropCap: { style: 'ornate', size: '3.8em', lineHeight: '0.74' },
    infoBox: { radius: '16px', shadow: '0 6px 18px rgba(139,92,246,0.15)', borderStyle: 'dashed' },
    hr: { style: 'decorative' },
    links: { decorationStyle: 'dotted', color: '#7c3aed' },
  },
  {
    id: 'theme-sakura',
    name: '사쿠라',
    category: 'colorful',
    preview: { bg: '#fdf2f8', text: '#831843', accent: '#ec4899' },
    fonts: { body: "'Noto Serif JP', 'Georgia', serif" },
    lineHeight: 1.85,
    colors: {
      bg: '#fdf2f8',
      text: '#831843',
      heading: '#9d174d',
      border: '#f9a8d4',
      quoteBg: '#fce7f3',
      quoteBorder: '#ec4899',
      accent: '#ec4899',
      infoBg: '#fce7f3',
      infoBorder: '#ec4899',
    },
    body: { maxWidth: '700px', padding: '3em 2em' },
    title: {
      weight: 'normal',
      align: 'center',
      decoration: 'accent-line',
      fontSize: '1.9em',
      letterSpacing: '0.08em',
    },
    quote: { style: 'bordered-box', radius: '16px', padded: true, align: 'center' },
    dropCap: { style: 'boxed', size: '3.5em', lineHeight: '0.82' },
    infoBox: { radius: '16px', shadow: '0 5px 15px rgba(236,72,153,0.12)', borderStyle: 'solid' },
    hr: { style: 'dotted' },
    links: { underline: false, color: '#db2777' },
  },
  {
    id: 'theme-sunset',
    name: '선셋 글로우',
    category: 'colorful',
    preview: { bg: '#fff7ed', text: '#9a3412', accent: '#ea580c' },
    fonts: { body: "'Lato', sans-serif" },
    lineHeight: 1.8,
    colors: {
      bg: '#fff7ed',
      text: '#9a3412',
      heading: '#c2410c',
      border: '#fdba74',
      quoteBg: '#ffedd5',
      quoteBorder: '#ea580c',
      accent: '#ea580c',
      infoBg: '#ffedd5',
      infoBorder: '#ea580c',
    },
    body: { maxWidth: '820px', padding: '2.25em 2.5em' },
    title: {
      weight: 'bold',
      align: 'center',
      decoration: 'double-border',
      fontSize: '1.65em',
      transform: 'uppercase',
      letterSpacing: '0.1em',
    },
    quote: { style: 'full-box', radius: '10px', padded: true, fontSize: '1.05em' },
    dropCap: { style: 'classic', size: '3.4em', lineHeight: '0.82' },
    infoBox: {
      radius: '10px',
      borderStyle: 'double',
      shadow: '0 4px 12px rgba(234,88,12,0.1)',
      titleColor: '#ea580c',
      titleTransform: 'uppercase',
      titleLetterSpacing: '0.05em',
    },
    hr: { style: 'dashed' },
    links: { color: '#ea580c', decorationStyle: 'dashed' },
  },
  // --- minimal ---
  {
    id: 'theme-swiss',
    name: '스위스 클린',
    category: 'minimal',
    preview: { bg: '#ffffff', text: '#000000', accent: '#ef4444' },
    fonts: { body: "'Helvetica Neue', Helvetica, Arial, sans-serif" },
    lineHeight: 1.7,
    colors: {
      bg: '#ffffff',
      text: '#000000',
      heading: '#000000',
      border: '#000000',
      quoteBg: '#fafafa',
      quoteBorder: '#ef4444',
      accent: '#ef4444',
      infoBg: '#fafafa',
      infoBorder: '#000000',
    },
    body: { maxWidth: '960px', padding: '2em 4em', letterSpacing: '-0.02em' },
    title: {
      weight: 'bold',
      transform: 'uppercase',
      align: 'left',
      decoration: 'none',
      borderWidth: '2px',
      letterSpacing: '0.15em',
      fontSize: '1.35em',
      marginBottom: '2em',
    },
    quote: { style: 'italic-only', fontSize: '1.05em', padding: '0.25em 0 0.25em 1em' },
    dropCap: { style: 'none' },
    infoBox: { radius: '0', borderStyle: 'solid', titleTransform: 'uppercase', titleLetterSpacing: '0.1em' },
    hr: { style: 'solid', width: '2px', margin: '3em 0' },
    links: { underline: true, color: '#ef4444', decorationStyle: 'solid' },
    code: { bgOpacity: 0.03, borderRadius: '0' },
  },
  {
    id: 'theme-mono',
    name: '모노 테크',
    category: 'minimal',
    preview: { bg: '#fafafa', text: '#171717', accent: '#22c55e' },
    fonts: { body: "'IBM Plex Mono', 'Consolas', monospace" },
    lineHeight: 1.75,
    colors: {
      bg: '#fafafa',
      text: '#171717',
      heading: '#171717',
      border: '#d4d4d4',
      quoteBg: '#f5f5f5',
      quoteBorder: '#22c55e',
      accent: '#22c55e',
      infoBg: '#f5f5f5',
      infoBorder: '#22c55e',
    },
    body: { maxWidth: '920px', padding: '1.75em 2.5em', fontSize: '0.95em', letterSpacing: '0' },
    title: {
      weight: 'bold',
      align: 'left',
      decoration: 'border-bottom',
      borderWidth: '1px',
      fontSize: '1.25em',
      transform: 'uppercase',
      letterSpacing: '0.08em',
    },
    quote: { style: 'bordered-box', radius: '0', padded: true, fontStyle: 'normal' },
    dropCap: { style: 'minimal', size: '2.5em', lineHeight: '0.95' },
    infoBox: {
      radius: '0',
      borderStyle: 'accent-left',
      titleColor: '#22c55e',
      titleTransform: 'uppercase',
      titleLetterSpacing: '0.06em',
    },
    hr: { style: 'dashed', margin: '2em 0' },
    links: { underline: false, color: '#16a34a' },
    code: { bgOpacity: 0.08, borderRadius: '0', border: '1px solid #d4d4d4', accentBorder: true },
  },
  // --- literary ---
  {
    id: 'theme-garamond',
    name: '가라몬드 클래식',
    category: 'literary',
    preview: { bg: '#fffef9', text: '#2c2416', accent: '#6b5b4f' },
    fonts: { body: "'EB Garamond', 'Garamond', serif" },
    lineHeight: 1.85,
    colors: {
      bg: '#fffef9',
      text: '#2c2416',
      heading: '#1a1510',
      border: '#c9b99a',
      quoteBg: '#f5f0e6',
      quoteBorder: '#6b5b4f',
      accent: '#6b5b4f',
      infoBg: '#f5f0e6',
      infoBorder: '#6b5b4f',
    },
    body: { maxWidth: '660px', padding: '3em 2em', fontSize: '1.08em' },
    title: {
      weight: 'normal',
      align: 'center',
      decoration: 'ornamental',
      fontSize: '2.1em',
      letterSpacing: '0.02em',
    },
    quote: { style: 'pull-quote', fontSize: '1.15em', radius: '0' },
    dropCap: { style: 'ornate', size: '4em', lineHeight: '0.68' },
    infoBox: { borderStyle: 'double', radius: '0', titleTransform: 'uppercase', titleLetterSpacing: '0.04em' },
    hr: { style: 'decorative' },
    links: { decorationStyle: 'solid' },
  },
  {
    id: 'theme-typewriter',
    name: '타자기',
    category: 'literary',
    preview: { bg: '#f5f5dc', text: '#333333', accent: '#555555' },
    fonts: { body: "'Courier New', 'Courier', monospace" },
    lineHeight: 1.6,
    colors: {
      bg: '#f5f5dc',
      text: '#333333',
      heading: '#111111',
      border: '#999999',
      quoteBg: '#ebebd8',
      quoteBorder: '#555555',
      accent: '#555555',
      infoBg: '#ebebd8',
      infoBorder: '#555555',
    },
    body: { maxWidth: '780px', padding: '2em 2.5em', fontSize: '0.98em' },
    title: {
      weight: 'bold',
      align: 'left',
      decoration: 'border-bottom',
      borderStyle: 'dashed',
      fontSize: '1.3em',
      transform: 'uppercase',
      letterSpacing: '0.12em',
    },
    quote: { style: 'bordered-box', radius: '0', padded: true, fontStyle: 'normal', fontSize: '0.95em' },
    dropCap: { style: 'none' },
    infoBox: { radius: '0', borderStyle: 'dashed', padding: '1em 1.25em' },
    hr: { style: 'dashed' },
    links: { underline: true, decorationStyle: 'dashed', color: '#333333' },
    code: { bgOpacity: 0.1, borderRadius: '0', border: '1px dashed #999999' },
  },
  // --- Phase 3 추가 12종 ---
  {
    id: 'theme-leather',
    name: '가죽책',
    category: 'literary',
    preview: { bg: '#2a1f16', text: '#e8dcc8', accent: '#c4a574' },
    fonts: { body: "'Palatino Linotype', 'Book Antiqua', Palatino, serif" },
    lineHeight: 1.85,
    colors: {
      bg: '#2a1f16',
      text: '#e8dcc8',
      heading: '#f5e6d0',
      border: '#5c4a38',
      quoteBg: '#3a2c20',
      quoteBorder: '#c4a574',
      accent: '#c4a574',
      infoBg: '#3a2c20',
      infoBorder: '#c4a574',
    },
    body: { maxWidth: '700px', padding: '2.75em 2em', fontSize: '1.05em' },
    title: { weight: 'normal', align: 'center', decoration: 'ornamental', fontSize: '2em' },
    quote: { style: 'pull-quote', fontSize: '1.12em' },
    dropCap: { style: 'ornate', size: '3.8em' },
    infoBox: { borderStyle: 'double', radius: '0' },
    hr: { style: 'decorative' },
    table: { style: 'table-minimal' },
    figure: { style: 'ruled', captionAlign: 'center' },
  },
  {
    id: 'theme-hanji',
    name: '한지',
    category: 'literary',
    preview: { bg: '#f7f2e8', text: '#3d3429', accent: '#8b6914' },
    fonts: { body: "'Batang', 'Nanum Myeongjo', 'Songti SC', serif" },
    lineHeight: 1.95,
    colors: {
      bg: '#f7f2e8',
      text: '#3d3429',
      heading: '#2a2218',
      border: '#d4c4a8',
      quoteBg: '#efe6d6',
      quoteBorder: '#8b6914',
      accent: '#8b6914',
      infoBg: '#efe6d6',
      infoBorder: '#8b6914',
    },
    body: { maxWidth: '680px', padding: '3em 2.25em', fontSize: '1.06em', letterSpacing: '0.02em' },
    title: { weight: 'normal', align: 'center', decoration: 'accent-line', fontSize: '1.9em' },
    quote: { style: 'italic-only' },
    dropCap: { style: 'classic', size: '3.6em' },
    infoBox: { borderStyle: 'accent-left', radius: '2px' },
    hr: { style: 'decorative' },
    table: { style: 'table-simple' },
    figure: { style: 'plain', captionAlign: 'center' },
  },
  {
    id: 'theme-broadsheet',
    name: '신문',
    category: 'press',
    preview: { bg: '#ffffff', text: '#111111', accent: '#b91c1c' },
    fonts: { body: "'Times New Roman', Times, serif" },
    lineHeight: 1.55,
    colors: {
      bg: '#ffffff',
      text: '#111111',
      heading: '#000000',
      border: '#111111',
      quoteBg: '#f5f5f5',
      quoteBorder: '#111111',
      accent: '#b91c1c',
      infoBg: '#f5f5f5',
      infoBorder: '#111111',
    },
    body: { maxWidth: '820px', padding: '1.5em 1.75em', fontSize: '0.98em' },
    title: {
      weight: '900',
      align: 'left',
      decoration: 'border-bottom',
      borderWidth: '3px',
      fontSize: '2.2em',
      transform: 'uppercase',
      letterSpacing: '0.02em',
    },
    quote: { style: 'full-box', fontStyle: 'normal', radius: '0' },
    dropCap: { style: 'minimal', size: '3em' },
    infoBox: { borderStyle: 'solid', radius: '0' },
    hr: { style: 'solid', width: '2px' },
    table: { style: 'table-bordered' },
    figure: { style: 'ruled', captionAlign: 'left' },
  },
  {
    id: 'theme-pocket',
    name: '포켓북',
    category: 'minimal',
    preview: { bg: '#fafafa', text: '#404040', accent: '#737373' },
    fonts: { body: "system-ui, -apple-system, 'Segoe UI', sans-serif" },
    lineHeight: 1.7,
    colors: {
      bg: '#fafafa',
      text: '#404040',
      heading: '#171717',
      border: '#e5e5e5',
      quoteBg: '#f5f5f5',
      quoteBorder: '#a3a3a3',
      accent: '#737373',
      infoBg: '#f5f5f5',
      infoBorder: '#a3a3a3',
    },
    body: { maxWidth: '520px', padding: '1.75em 1.25em', fontSize: '0.95em' },
    title: { weight: 'bold', align: 'left', decoration: 'none', fontSize: '1.45em' },
    quote: { style: 'italic-only' },
    dropCap: { style: 'none' },
    infoBox: { borderStyle: 'solid', radius: '6px' },
    hr: { style: 'accent-wide' },
    table: { style: 'table-minimal' },
    figure: { style: 'plain', captionAlign: 'center', imageRadius: '4px' },
  },
  {
    id: 'theme-atelier',
    name: '아틀리에',
    category: 'colorful',
    preview: { bg: '#ffffff', text: '#1f1f1f', accent: '#db2777' },
    fonts: { body: "'Helvetica Neue', Helvetica, Arial, sans-serif" },
    lineHeight: 1.75,
    colors: {
      bg: '#ffffff',
      text: '#1f1f1f',
      heading: '#111111',
      border: '#fce7f3',
      quoteBg: '#fdf2f8',
      quoteBorder: '#db2777',
      accent: '#db2777',
      infoBg: '#fdf2f8',
      infoBorder: '#db2777',
    },
    body: { maxWidth: '720px', padding: '2.5em 2em', fontSize: '1.02em' },
    title: { weight: 'bold', align: 'center', decoration: 'accent-line', fontSize: '1.85em' },
    quote: { style: 'pull-quote', radius: '0' },
    dropCap: { style: 'boxed', size: '3.2em' },
    infoBox: { borderStyle: 'solid', radius: '12px', shadow: '0 8px 24px rgba(219,39,119,0.08)' },
    hr: { style: 'accent-wide' },
    table: { style: 'table-card' },
    figure: { style: 'shadow', captionAlign: 'center', imageRadius: '8px' },
  },
  {
    id: 'theme-inkwell',
    name: '먹물',
    category: 'dark',
    preview: { bg: '#0c0c0c', text: '#d4d4d4', accent: '#a3a3a3' },
    fonts: { body: "'Georgia', serif" },
    lineHeight: 1.8,
    colors: {
      bg: '#0c0c0c',
      text: '#d4d4d4',
      heading: '#f5f5f5',
      border: '#333333',
      quoteBg: '#171717',
      quoteBorder: '#a3a3a3',
      accent: '#a3a3a3',
      infoBg: '#171717',
      infoBorder: '#525252',
    },
    body: { maxWidth: '700px', padding: '2.5em 2em' },
    title: { weight: 'normal', align: 'center', decoration: 'underline', fontSize: '1.9em' },
    quote: { style: 'left-bar' },
    dropCap: { style: 'minimal', size: '3.4em' },
    infoBox: { borderStyle: 'accent-left', radius: '0' },
    hr: { style: 'dotted' },
    table: { style: 'table-simple' },
    figure: { style: 'plain', captionAlign: 'center' },
  },
  {
    id: 'theme-parchment',
    name: '양피지',
    category: 'sepia',
    preview: { bg: '#f3e9d2', text: '#4a3728', accent: '#9a6b3f' },
    fonts: { body: "'Palatino Linotype', Palatino, serif" },
    lineHeight: 1.9,
    colors: {
      bg: '#f3e9d2',
      text: '#4a3728',
      heading: '#3b2a1c',
      border: '#c9b08a',
      quoteBg: '#e8d9b8',
      quoteBorder: '#9a6b3f',
      accent: '#9a6b3f',
      infoBg: '#e8d9b8',
      infoBorder: '#9a6b3f',
    },
    body: { maxWidth: '700px', padding: '2.75em 2.25em', fontSize: '1.05em' },
    title: { weight: 'normal', align: 'center', decoration: 'double-border', fontSize: '2em' },
    quote: { style: 'bordered-box', radius: '0', padded: true },
    dropCap: { style: 'ornate', size: '4em' },
    infoBox: { borderStyle: 'double', radius: '0' },
    hr: { style: 'double' },
    table: { style: 'table-simple' },
    figure: { style: 'polaroid', captionAlign: 'center' },
  },
  {
    id: 'theme-nordic',
    name: '노르딕',
    category: 'light',
    preview: { bg: '#f4f6f8', text: '#334155', accent: '#64748b' },
    fonts: { body: "'Inter', 'Helvetica Neue', Arial, sans-serif" },
    lineHeight: 1.75,
    colors: {
      bg: '#f4f6f8',
      text: '#334155',
      heading: '#0f172a',
      border: '#cbd5e1',
      quoteBg: '#e2e8f0',
      quoteBorder: '#64748b',
      accent: '#64748b',
      infoBg: '#e2e8f0',
      infoBorder: '#94a3b8',
    },
    body: { maxWidth: '700px', padding: '2.25em 2em', fontSize: '1em' },
    title: { weight: 'bold', align: 'left', decoration: 'accent-line', fontSize: '1.7em' },
    quote: { style: 'full-box', radius: '8px', fontStyle: 'normal' },
    dropCap: { style: 'none' },
    infoBox: { borderStyle: 'solid', radius: '8px' },
    hr: { style: 'solid' },
    table: { style: 'table-minimal' },
    figure: { style: 'shadow', captionAlign: 'center', imageRadius: '6px' },
  },
  {
    id: 'theme-blossom',
    name: '블라섬',
    category: 'colorful',
    preview: { bg: '#fff5f7', text: '#4a3040', accent: '#e879a9' },
    fonts: { body: "'Georgia', serif" },
    lineHeight: 1.8,
    colors: {
      bg: '#fff5f7',
      text: '#4a3040',
      heading: '#3b1f2e',
      border: '#f9c5d5',
      quoteBg: '#ffe4ec',
      quoteBorder: '#e879a9',
      accent: '#e879a9',
      infoBg: '#ffe4ec',
      infoBorder: '#e879a9',
    },
    body: { maxWidth: '700px', padding: '2.5em 2em' },
    title: { weight: 'normal', align: 'center', decoration: 'ornamental', fontSize: '1.9em' },
    quote: { style: 'left-bar', radius: '0 10px 10px 0', padded: true },
    dropCap: { style: 'classic', size: '3.5em' },
    infoBox: { borderStyle: 'accent-left', radius: '10px', shadow: '0 2px 8px rgba(232,121,169,0.12)' },
    hr: { style: 'decorative' },
    table: { style: 'table-striped' },
    figure: { style: 'polaroid', captionAlign: 'center' },
  },
  {
    id: 'theme-slate-editorial',
    name: '슬레이트 에디토리얼',
    category: 'press',
    preview: { bg: '#f8fafc', text: '#1e293b', accent: '#0f766e' },
    fonts: { body: "'Libre Baskerville', 'Georgia', serif" },
    lineHeight: 1.7,
    colors: {
      bg: '#f8fafc',
      text: '#1e293b',
      heading: '#0f172a',
      border: '#cbd5e1',
      quoteBg: '#f1f5f9',
      quoteBorder: '#0f766e',
      accent: '#0f766e',
      infoBg: '#ecfdf5',
      infoBorder: '#0f766e',
    },
    body: { maxWidth: '740px', padding: '2.25em 2em', fontSize: '1.02em' },
    title: { weight: 'bold', align: 'left', decoration: 'border-bottom', borderWidth: '2px', fontSize: '1.85em' },
    quote: { style: 'full-box', radius: '4px', fontStyle: 'normal' },
    dropCap: { style: 'boxed', size: '3em' },
    infoBox: { borderStyle: 'accent-left', radius: '4px', titleTransform: 'uppercase', titleLetterSpacing: '0.06em' },
    hr: { style: 'solid' },
    table: { style: 'table-header-accent' },
    figure: { style: 'ruled', captionAlign: 'center' },
  },
  {
    id: 'theme-midnight-gold',
    name: '미드나잇 골드',
    category: 'dark',
    preview: { bg: '#0b1220', text: '#e2e8f0', accent: '#d4a017' },
    fonts: { body: "'Georgia', serif" },
    lineHeight: 1.85,
    colors: {
      bg: '#0b1220',
      text: '#e2e8f0',
      heading: '#f8fafc',
      border: '#1e293b',
      quoteBg: '#111827',
      quoteBorder: '#d4a017',
      accent: '#d4a017',
      infoBg: '#111827',
      infoBorder: '#d4a017',
    },
    body: { maxWidth: '700px', padding: '2.75em 2em' },
    title: { weight: 'normal', align: 'center', decoration: 'ornamental', fontSize: '2em', letterSpacing: '0.04em' },
    quote: { style: 'pull-quote', fontSize: '1.15em' },
    dropCap: { style: 'glow', size: '3.6em' },
    infoBox: { borderStyle: 'double', radius: '0', titleColor: '#d4a017' },
    hr: { style: 'decorative' },
    table: { style: 'table-header-accent' },
    figure: { style: 'shadow', captionAlign: 'center', imageRadius: '4px' },
  },
  {
    id: 'theme-meadow',
    name: '목초지',
    category: 'light',
    preview: { bg: '#f4faf5', text: '#1f3d2b', accent: '#3d8b5f' },
    fonts: { body: "'Helvetica Neue', Helvetica, Arial, sans-serif" },
    lineHeight: 1.8,
    colors: {
      bg: '#f4faf5',
      text: '#1f3d2b',
      heading: '#143022',
      border: '#c5e0cf',
      quoteBg: '#e6f4ea',
      quoteBorder: '#3d8b5f',
      accent: '#3d8b5f',
      infoBg: '#e6f4ea',
      infoBorder: '#3d8b5f',
    },
    body: { maxWidth: '720px', padding: '2.5em 2em' },
    title: { weight: 'bold', align: 'center', decoration: 'accent-line', fontSize: '1.8em' },
    quote: { style: 'left-bar', padded: true, radius: '0 8px 8px 0' },
    dropCap: { style: 'classic', size: '3.4em' },
    infoBox: { borderStyle: 'accent-left', radius: '8px', shadow: '0 2px 8px rgba(61,139,95,0.1)' },
    hr: { style: 'accent-wide' },
    table: { style: 'table-striped' },
    figure: { style: 'plain', captionAlign: 'center', imageRadius: '6px' },
  },
];

export const DEFAULT_THEME_ID = 'theme-classic';

const THEME_ID_SET = new Set(THEME_TOKEN_LIST.map((t) => t.id));

export function isValidThemeId(id: string): boolean {
  return THEME_ID_SET.has(id);
}
