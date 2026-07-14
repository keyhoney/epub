import type { ReaderThemeId } from '@/lib/types/book';
import {
  THEME_TOKEN_LIST,
  type ThemeCategory,
  type ThemeTokens,
} from './themeTokens';

export { DEFAULT_THEME_ID, isValidThemeId } from './themeTokens';

export type { ThemeCategory };

export interface ReaderTheme {
  id: ReaderThemeId;
  name: string;
  category: Exclude<ThemeCategory, 'all'>;
  preview: { bg: string; text: string; accent: string };
  css: string;
}

export const THEME_CATEGORIES: { id: ThemeCategory; label: string }[] = [
  { id: 'all', label: '전체' },
  { id: 'light', label: '밝음' },
  { id: 'dark', label: '어두움' },
  { id: 'sepia', label: '세피아' },
  { id: 'colorful', label: '컬러' },
  { id: 'minimal', label: '미니멀' },
  { id: 'literary', label: '문학' },
  { id: 'press', label: '출판' },
];

function buildTitleCss(tokens: ThemeTokens): string {
  const { colors, title } = tokens;
  const weight = title?.weight ?? 'bold';
  const transform = title?.transform ?? 'none';
  const align = title?.align ?? 'center';
  const fontSize = title?.fontSize ?? '1.8em';
  const letterSpacing = title?.letterSpacing ?? 'normal';
  const marginBottom = title?.marginBottom ?? '1.5em';
  const decoration = title?.decoration ?? 'border-bottom';
  const borderWidth = title?.borderWidth ?? '1px';
  const borderStyle = title?.borderStyle ?? 'solid';

  const base = `h1.chapter-title { text-align: ${align}; font-size: ${fontSize}; margin-top: 0; margin-bottom: ${marginBottom}; font-weight: ${weight}; color: ${colors.heading}; text-transform: ${transform}; letter-spacing: ${letterSpacing}; }`;

  switch (decoration) {
    case 'none':
      return `${base}
h1.chapter-title { border: none; padding-bottom: 0; }`;
    case 'underline':
      return `${base}
h1.chapter-title { border: none; padding-bottom: 0.25em; text-decoration: underline; text-decoration-color: ${colors.accent}; text-underline-offset: 0.35em; text-decoration-thickness: ${borderWidth}; }`;
    case 'double-border':
      return `${base}
h1.chapter-title { border: none; border-bottom: ${borderWidth} double ${colors.border}; padding-bottom: 0.5em; }`;
    case 'ornamental':
      return `${base}
h1.chapter-title { border: none; padding-bottom: 0.75em; position: relative; }
h1.chapter-title::after { content: '◆ ◆ ◆'; display: block; font-size: 0.35em; letter-spacing: 0.6em; color: ${colors.accent}; margin-top: 0.75em; font-weight: normal; }`;
    case 'accent-line': {
      const lineMargin =
        align === 'center' ? '0.6em auto 0' : align === 'right' ? '0.6em 0 0 auto' : '0.6em 0 0';
      return `${base}
h1.chapter-title { border: none; padding-bottom: 0.5em; position: relative; }
h1.chapter-title::after { content: ''; display: block; width: 3em; height: 3px; background: ${colors.accent}; margin: ${lineMargin}; }`;
    }
    case 'border-bottom':
    default:
      return `${base}
h1.chapter-title { border-bottom: ${borderWidth} ${borderStyle} ${colors.border}; padding-bottom: 0.5em; }`;
  }
}

function buildQuoteCss(tokens: ThemeTokens): string {
  const { colors, quote } = tokens;
  const style = quote?.style ?? 'left-bar';
  const fontSize = quote?.fontSize ?? 'inherit';
  const fontStyle = quote?.fontStyle ?? 'italic';
  const align = quote?.align ?? 'left';
  const radius = quote?.radius ?? '0';
  const padding =
    quote?.padding ??
    (quote?.padded
      ? '1em 1em 1em 1.5em'
      : style === 'italic-only'
        ? '0 0 0 1em'
        : '1em');

  const cite = `.epub-quote cite, blockquote cite { display: block; text-align: right; font-size: 0.9em; font-weight: bold; margin-top: 0.5em; }`;

  switch (style) {
    case 'full-box':
      return `.epub-quote, blockquote { border: 1px solid ${colors.quoteBorder}; border-left: 4px solid ${colors.quoteBorder}; margin: 1.5em 0; font-style: ${fontStyle}; color: ${colors.text}; background: ${colors.quoteBg}; padding: ${padding}; border-radius: ${radius}; font-size: ${fontSize}; text-align: ${align}; }
${cite}`;
    case 'italic-only':
      return `.epub-quote, blockquote { border: none; border-left: 2px solid ${colors.quoteBorder}; margin: 1.5em 0; font-style: ${fontStyle}; color: ${colors.text}; background: transparent; padding: ${padding}; border-radius: 0; font-size: ${fontSize}; text-align: ${align}; }
${cite}`;
    case 'pull-quote':
      return `.epub-quote, blockquote { border: none; border-top: 2px solid ${colors.quoteBorder}; border-bottom: 2px solid ${colors.quoteBorder}; margin: 2em auto; font-style: ${fontStyle}; color: ${colors.heading}; background: ${colors.quoteBg}; padding: 1.25em 2em; border-radius: ${radius}; font-size: ${fontSize || '1.15em'}; text-align: center; max-width: 85%; }
${cite}`;
    case 'bordered-box':
      return `.epub-quote, blockquote { border: 2px dashed ${colors.quoteBorder}; margin: 1.5em 0; font-style: ${fontStyle}; color: ${colors.text}; background: ${colors.quoteBg}; padding: ${padding}; border-radius: ${radius}; font-size: ${fontSize}; text-align: ${align}; }
${cite}`;
    case 'left-bar':
    default:
      return `.epub-quote, blockquote { border-left: 4px solid ${colors.quoteBorder}; margin: 1.5em 0; font-style: ${fontStyle}; color: ${colors.text}; background: ${colors.quoteBg}; padding: ${padding}; border-radius: ${radius}; font-size: ${fontSize}; text-align: ${align}; }
${cite}`;
  }
}

function buildInfoBoxCss(tokens: ThemeTokens): string {
  const { colors, infoBox } = tokens;
  const radius = infoBox?.radius ?? '4px';
  const shadow = infoBox?.shadow ?? 'none';
  const padding = infoBox?.padding ?? '1em';
  const borderStyle = infoBox?.borderStyle ?? 'accent-left';
  const titleTransform = infoBox?.titleTransform ?? 'none';
  const titleLetterSpacing = infoBox?.titleLetterSpacing ?? 'normal';
  const titleColor = infoBox?.titleColor ?? colors.heading;

  let borderCss: string;
  switch (borderStyle) {
    case 'dashed':
      borderCss = `border: 2px dashed ${colors.infoBorder};`;
      break;
    case 'double':
      borderCss = `border: 3px double ${colors.infoBorder};`;
      break;
    case 'solid':
      borderCss = `border: 1px solid ${colors.infoBorder};`;
      break;
    case 'accent-left':
    default:
      borderCss = `border: 1px solid ${colors.infoBorder}; border-left: 4px solid ${colors.infoBorder};`;
  }

  return `.info-box { background: ${colors.infoBg}; ${borderCss} padding: ${padding}; margin: 2em 0; border-radius: ${radius}; box-shadow: ${shadow}; }
.info-box h2 { margin-top: 0; font-size: 1.1em; color: ${titleColor}; text-transform: ${titleTransform}; letter-spacing: ${titleLetterSpacing}; margin-bottom: 0.5em; }
.info-box p { margin: 0; font-size: 0.95em; }
.info-box[data-variant="tip"] { background: #ecfdf5; border-color: #10b981; border-left-color: #10b981; }
.info-box[data-variant="tip"] h2 { color: #047857; }
.info-box[data-variant="warning"] { background: #fffbeb; border-color: #f59e0b; border-left-color: #f59e0b; }
.info-box[data-variant="warning"] h2 { color: #b45309; }
.info-box[data-variant="example"] { background: #f8fafc; border-color: #94a3b8; border-left-color: #64748b; }
.info-box[data-variant="example"] h2 { color: #334155; }
.info-box[data-variant="info"] { }`;
}

function buildDropCapCss(tokens: ThemeTokens): string {
  const { colors, dropCap } = tokens;
  const size = dropCap?.size ?? tokens.dropCapSize ?? '3.5em';
  const lineHeight = dropCap?.lineHeight ?? tokens.dropCapLineHeight ?? '0.8';
  const style = dropCap?.style ?? 'classic';
  const marginRight = dropCap?.marginRight ?? '0.1em';

  if (style === 'none') {
    return `p.drop-cap .first-letter { font-size: inherit; float: none; line-height: inherit; margin-right: 0; font-weight: inherit; color: inherit; }`;
  }

  const base = `p.drop-cap .first-letter { font-size: ${size}; float: left; line-height: ${lineHeight}; margin-right: ${marginRight}; font-weight: bold; color: ${colors.accent}; }`;

  switch (style) {
    case 'boxed':
      return `${base}
p.drop-cap .first-letter { background: ${colors.infoBg}; border: 2px solid ${colors.accent}; padding: 0.05em 0.15em; border-radius: 4px; }`;
    case 'minimal':
      return `${base}
p.drop-cap .first-letter { font-weight: normal; font-size: ${size}; color: ${colors.heading}; }`;
    case 'ornate':
      return `${base}
p.drop-cap .first-letter { font-family: ${tokens.fonts.body}; text-shadow: 1px 1px 0 ${colors.border}; border-bottom: 2px solid ${colors.accent}; padding-bottom: 0.05em; }`;
    case 'glow':
      return `${base}
p.drop-cap .first-letter { text-shadow: 0 0 12px ${colors.accent}, 0 0 24px ${colors.accent}; }`;
    case 'classic':
    default:
      return base;
  }
}

function buildHrCss(tokens: ThemeTokens): string {
  const { colors, hr, title } = tokens;
  const style = hr?.style ?? tokens.hrStyle ?? title?.borderStyle ?? 'solid';
  const width = hr?.width ?? title?.borderWidth ?? '1px';
  const margin = hr?.margin ?? '2em 0';

  switch (style) {
    case 'dotted':
      return `hr { border: none; border-top: ${width} dotted ${colors.border}; margin: ${margin}; }`;
    case 'dashed':
      return `hr { border: none; border-top: ${width} dashed ${colors.border}; margin: ${margin}; }`;
    case 'double':
      return `hr { border: none; border-top: ${width} double ${colors.border}; margin: ${margin}; height: 3px; }`;
    case 'accent-wide':
      return `hr { border: none; border-top: 3px solid ${colors.accent}; margin: ${margin}; width: 40%; margin-left: auto; margin-right: auto; opacity: 0.7; }`;
    case 'decorative':
      return `hr { border: none; margin: ${margin}; text-align: center; overflow: visible; height: auto; }
hr::before { content: '· · · ◆ · · ·'; color: ${colors.accent}; letter-spacing: 0.4em; font-size: 0.85em; }`;
    case 'solid':
    default:
      return `hr { border: none; border-top: ${width} solid ${colors.border}; margin: ${margin}; }`;
  }
}

function buildLinkCss(tokens: ThemeTokens): string {
  const { colors, links } = tokens;
  const color = links?.color ?? colors.accent;
  const underline = links?.underline ?? true;
  const decorationStyle = links?.decorationStyle ?? 'solid';

  if (!underline) {
    return `a { color: ${color}; text-decoration: none; }
a:hover { text-decoration: underline; text-decoration-color: ${color}; }`;
  }
  return `a { color: ${color}; text-decoration: underline; text-decoration-style: ${decorationStyle}; text-underline-offset: 0.2em; }
a:hover { opacity: 0.85; }`;
}

function buildTableCss(tokens: ThemeTokens): string {
  const { colors } = tokens;
  const table = tokens.table ?? {
    style: 'table-simple' as const,
    borderColor: colors.border,
    headerBg: colors.infoBg,
    headerText: colors.heading,
    stripeBg: colors.quoteBg,
    radius: '0',
    cellPadding: '0.5em 0.75em',
  };
  const border = table.borderColor ?? colors.border;
  const pad = table.cellPadding ?? '0.5em 0.75em';
  const radius = table.radius ?? '0';
  const fontSize = table.fontSize ?? '0.95em';
  const headerBg = table.headerBg ?? colors.infoBg;
  const headerText = table.headerText ?? colors.heading;
  const stripe = table.stripeBg ?? colors.quoteBg;

  const base = `table, table.epub-table { width: 100%; border-collapse: collapse; margin: 1.5em 0; font-size: ${fontSize}; }
.tableWrapper { overflow-x: auto; -webkit-overflow-scrolling: touch; margin: 1em 0; }`;

  switch (table.style) {
    case 'table-striped':
      return `${base}
th, td { border: 1px solid ${border}; padding: ${pad}; text-align: left; }
th { font-weight: bold; background: ${headerBg}; color: ${headerText}; }
tbody tr:nth-child(even) td { background: ${stripe}; }`;
    case 'table-bordered':
      return `${base}
table, table.epub-table { border: 2px solid ${border}; }
th, td { border: 1px solid ${border}; padding: ${pad}; text-align: left; }
th { font-weight: bold; background: ${headerBg}; color: ${headerText}; }`;
    case 'table-header-accent':
      return `${base}
th, td { border: 1px solid ${border}; padding: ${pad}; text-align: left; }
th { font-weight: bold; background: ${headerBg}; color: ${headerText}; border-color: ${headerBg}; }
td { background: transparent; }`;
    case 'table-minimal':
      return `${base}
th, td { border: none; border-bottom: 1px solid ${border}; padding: ${pad}; text-align: left; }
th { font-weight: bold; color: ${headerText}; border-bottom: 2px solid ${border}; }
td { background: transparent; }`;
    case 'table-card':
      return `${base}
table, table.epub-table { border: 1px solid ${border}; border-radius: ${radius}; overflow: hidden; border-collapse: separate; border-spacing: 0; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
th, td { border-bottom: 1px solid ${border}; padding: ${pad}; text-align: left; }
th { font-weight: bold; background: ${headerBg}; color: ${headerText}; }
tr:last-child td { border-bottom: none; }`;
    case 'table-simple':
    default:
      return `${base}
th, td { border: 1px solid ${border}; padding: ${pad}; text-align: left; }
th { font-weight: bold; background: ${headerBg}; color: ${headerText}; }`;
  }
}

function buildFigureCss(tokens: ThemeTokens): string {
  const { colors } = tokens;
  const figure = tokens.figure ?? {
    style: 'plain' as const,
    captionAlign: 'center' as const,
    captionSize: '0.85em',
    captionColor: colors.text,
    imageRadius: '0',
  };
  const align = figure.captionAlign ?? 'center';
  const capSize = figure.captionSize ?? '0.85em';
  const capColor = figure.captionColor ?? colors.text;
  const radius = figure.imageRadius ?? '0';

  const caption = `figcaption { font-size: ${capSize}; opacity: 0.8; margin-top: 0.5em; font-style: italic; text-align: ${align}; color: ${capColor}; }`;
  const img = `figure.epub-figure img { display: block; margin: 0 auto; max-width: 100%; border-radius: ${radius}; }`;

  switch (figure.style) {
    case 'ruled':
      return `figure.epub-figure { margin: 1.75em 0; text-align: center; padding: 1em 0; border-top: 1px solid ${colors.border}; border-bottom: 1px solid ${colors.border}; }
${img}
${caption}`;
    case 'shadow':
      return `figure.epub-figure { margin: 1.75em 0; text-align: center; }
figure.epub-figure img { display: block; margin: 0 auto; max-width: 100%; border-radius: ${radius}; box-shadow: 0 8px 24px rgba(0,0,0,0.12); }
${caption}`;
    case 'polaroid':
      return `figure.epub-figure { margin: 1.75em auto; text-align: center; background: #fff; padding: 0.75em 0.75em 1em; max-width: 90%; box-shadow: 0 4px 16px rgba(0,0,0,0.1); border: 1px solid ${colors.border}; }
figure.epub-figure img { display: block; margin: 0 auto; max-width: 100%; border-radius: ${radius}; }
${caption}`;
    case 'plain':
    default:
      return `figure.epub-figure { margin: 1.5em 0; text-align: center; }
${img}
${caption}`;
  }
}

function buildCodeCss(tokens: ThemeTokens): string {
  const { colors, code } = tokens;
  const bgOpacity = code?.bgOpacity ?? 0.06;
  const borderRadius = code?.borderRadius ?? '4px';
  const border = code?.border ?? 'none';
  const accentBorder = code?.accentBorder
    ? `border-left: 3px solid ${colors.accent};`
    : '';

  return `pre { background: rgba(0,0,0,${bgOpacity}); padding: 1em; border-radius: ${borderRadius}; overflow-x: auto; margin: 1em 0; border: ${border}; ${accentBorder} }
code { font-family: Consolas, Monaco, monospace; font-size: 0.9em; background: rgba(0,0,0,${bgOpacity}); padding: 0.15em 0.35em; border-radius: 3px; color: ${colors.heading}; }
pre code { background: none; padding: 0; color: inherit; }
mark { border-radius: 2px; padding: 0 0.15em; background: ${colors.quoteBg}; color: ${colors.text}; }
p.spacer { margin: 2em 0; }
ul, ol { margin: 1em 0; padding-left: 1.5em; }
blockquote.epigraph { text-align: center; font-style: italic; margin: 2.5em 2em; border: none; background: transparent; padding: 0; font-size: 1.1em; color: ${colors.heading}; }
blockquote.epigraph cite { display: block; margin-top: 0.75em; font-size: 0.85em; font-style: normal; opacity: 0.8; }
aside.footnote { font-size: 0.85em; margin: 1.5em 0; padding: 0.75em 1em; border-top: 1px dashed ${colors.border}; color: ${colors.text}; opacity: 0.9; }
aside.footnote p { margin: 0; }
hr.page-break { border: none; border-top: 2px dashed ${colors.border}; margin: 3em 0; page-break-after: always; break-after: page; }
.line-height-normal { line-height: 1.5; }
.line-height-relaxed { line-height: 1.8; }
.line-height-loose { line-height: 2; }
.letter-normal { letter-spacing: normal; }
.letter-wide { letter-spacing: 0.05em; }
.indent-1 { text-indent: 1.5em; }
.indent-2 { text-indent: 3em; }
.outdent { margin-left: -1.5em; padding-left: 1.5em; }
.text-size-sm { font-size: 0.9em; }
.text-size-md { font-size: 1em; }
.text-size-lg { font-size: 1.15em; }
.text-size-xl { font-size: 1.3em; }
.font-serif { font-family: Georgia, 'Times New Roman', serif; }
.font-sans { font-family: system-ui, -apple-system, 'Segoe UI', sans-serif; }
.font-mono { font-family: Consolas, Monaco, monospace; }
.font-gothic { font-family: 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; }
.font-myeongjo { font-family: 'Nanum Myeongjo', Batang, serif; }
.font-nanum { font-family: 'Nanum Gothic', 'Malgun Gothic', sans-serif; }
h2 { font-size: 1.5em; font-weight: bold; margin: 1.5em 0 0.75em; color: ${colors.heading}; }
h3 { font-size: 1.25em; font-weight: bold; margin: 1.25em 0 0.5em; color: ${colors.heading}; }
h4 { font-size: 1.1em; font-weight: bold; margin: 1em 0 0.5em; color: ${colors.heading}; }
img.epub-image[data-align="center"] { display: block; margin-left: auto; margin-right: auto; }
img.epub-image[data-align="right"] { display: block; margin-left: auto; margin-right: 0; }
a[epub|type="noteref"] { text-decoration: none; color: ${colors.accent}; font-size: 0.85em; vertical-align: super; }`;
}

export function buildThemeCss(tokens: ThemeTokens): string {
  const { colors, fonts, body } = tokens;
  const lineHeight = tokens.lineHeight ?? 1.8;
  const maxWidth = body?.maxWidth ?? '800px';
  const padding = body?.padding ?? '2em';
  const fontSize = body?.fontSize ?? '1em';
  const letterSpacing = body?.letterSpacing ?? 'normal';

  return `body { font-family: ${fonts.body}; line-height: ${lineHeight}; padding: ${padding}; max-width: ${maxWidth}; margin: auto; background-color: ${colors.bg}; color: ${colors.text}; font-size: ${fontSize}; letter-spacing: ${letterSpacing}; }
${buildTitleCss(tokens)}
${buildQuoteCss(tokens)}
${buildDropCapCss(tokens)}
${buildInfoBoxCss(tokens)}
p { margin: 1em 0; }
img { max-width: 100%; height: auto; }
${buildHrCss(tokens)}
${buildLinkCss(tokens)}
${buildTableCss(tokens)}
${buildFigureCss(tokens)}
${buildCodeCss(tokens)}`;
}

function tokenToReaderTheme(token: ThemeTokens): ReaderTheme {
  return {
    id: token.id,
    name: token.name,
    category: token.category,
    preview: token.preview,
    css: buildThemeCss(token),
  };
}

export const READER_THEMES: ReaderTheme[] =
  THEME_TOKEN_LIST.map(tokenToReaderTheme);

export function getThemeCss(themeId: ReaderThemeId): string {
  const theme = READER_THEMES.find((t) => t.id === themeId);
  return theme?.css ?? READER_THEMES[0].css;
}

export function getThemeById(themeId: ReaderThemeId): ReaderTheme {
  return READER_THEMES.find((t) => t.id === themeId) ?? READER_THEMES[0];
}

export function getThemesByCategory(
  category: ThemeCategory,
): ReaderTheme[] {
  if (category === 'all') return READER_THEMES;
  return READER_THEMES.filter((t) => t.category === category);
}
