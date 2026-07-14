import type {
  DropCapStyle,
  HrStyle,
  QuoteStyle,
  ThemeDropCapTokens,
  ThemeFigureTokens,
  ThemeHrTokens,
  ThemeInfoBoxTokens,
  ThemeQuoteTokens,
  ThemeTableTokens,
  TableStyleId,
  FigureStyleId,
} from './themeTokens';

export interface StyleCatalogEntry<T> {
  id: string;
  label: string;
  description?: string;
  preview: { a: string; b: string; c: string };
  tokens: T;
}

export const TABLE_STYLES: StyleCatalogEntry<
  Pick<ThemeTableTokens, 'style' | 'radius' | 'cellPadding' | 'fontSize'>
>[] = [
  {
    id: 'table-simple',
    label: '깔끔한 표',
    description: '얇은 테두리와 옅은 머리글',
    preview: { a: '#f8fafc', b: '#e2e8f0', c: '#64748b' },
    tokens: { style: 'table-simple', radius: '0', cellPadding: '0.5em 0.75em' },
  },
  {
    id: 'table-striped',
    label: '줄무늬',
    description: '행이 번갈아 강조됩니다',
    preview: { a: '#ffffff', b: '#f1f5f9', c: '#334155' },
    tokens: { style: 'table-striped', radius: '0', cellPadding: '0.5em 0.75em' },
  },
  {
    id: 'table-bordered',
    label: '격자',
    description: '강한 외곽과 셀 그리드',
    preview: { a: '#fff', b: '#cbd5e1', c: '#0f172a' },
    tokens: { style: 'table-bordered', radius: '0', cellPadding: '0.55em 0.8em' },
  },
  {
    id: 'table-header-accent',
    label: '강조 머리글',
    description: '머리글에 포인트 색',
    preview: { a: '#3b82f6', b: '#ffffff', c: '#1e293b' },
    tokens: {
      style: 'table-header-accent',
      radius: '4px',
      cellPadding: '0.55em 0.8em',
    },
  },
  {
    id: 'table-minimal',
    label: '가로선만',
    description: '책처럼 가로선만 있는 표',
    preview: { a: '#fff', b: '#d4d4d4', c: '#404040' },
    tokens: { style: 'table-minimal', radius: '0', cellPadding: '0.6em 0.4em' },
  },
  {
    id: 'table-card',
    label: '카드형',
    description: '둥근 모서리와 여백',
    preview: { a: '#f8fafc', b: '#e2e8f0', c: '#475569' },
    tokens: {
      style: 'table-card',
      radius: '10px',
      cellPadding: '0.65em 0.9em',
    },
  },
];

export const INFO_BOX_STYLES: StyleCatalogEntry<ThemeInfoBoxTokens>[] = [
  {
    id: 'infobox-accent-left',
    label: '왼쪽 강조',
    description: '왼쪽 포인트 선',
    preview: { a: '#eff6ff', b: '#3b82f6', c: '#1e3a8a' },
    tokens: {
      borderStyle: 'accent-left',
      radius: '4px',
      shadow: '0 1px 3px rgba(0,0,0,0.06)',
    },
  },
  {
    id: 'infobox-solid',
    label: '단정한 박스',
    description: '얇은 실선 테두리',
    preview: { a: '#f8fafc', b: '#94a3b8', c: '#0f172a' },
    tokens: { borderStyle: 'solid', radius: '6px', padding: '1em 1.15em' },
  },
  {
    id: 'infobox-dashed',
    label: '점선 박스',
    description: '점선으로 가볍게',
    preview: { a: '#fffbeb', b: '#f59e0b', c: '#78350f' },
    tokens: { borderStyle: 'dashed', radius: '8px' },
  },
  {
    id: 'infobox-double',
    label: '이중선',
    description: '고전적인 이중 테두리',
    preview: { a: '#faf5ff', b: '#a78bfa', c: '#4c1d95' },
    tokens: { borderStyle: 'double', radius: '0', titleTransform: 'uppercase' },
  },
  {
    id: 'infobox-soft-shadow',
    label: '부드러운 그림자',
    description: '그림자로 살짝 띄움',
    preview: { a: '#f0fdf4', b: '#22c55e', c: '#14532d' },
    tokens: {
      borderStyle: 'solid',
      radius: '10px',
      shadow: '0 4px 14px rgba(0,0,0,0.08)',
    },
  },
];

export const QUOTE_STYLES: StyleCatalogEntry<ThemeQuoteTokens>[] = [
  {
    id: 'quote-left-bar',
    label: '왼쪽 바',
    description: '인용 왼쪽 강조선',
    preview: { a: '#f8fafc', b: '#64748b', c: '#0f172a' },
    tokens: { style: 'left-bar' as QuoteStyle, padded: true },
  },
  {
    id: 'quote-full-box',
    label: '채움 박스',
    description: '배경이 있는 인용',
    preview: { a: '#f1f5f9', b: '#475569', c: '#0f172a' },
    tokens: { style: 'full-box' as QuoteStyle, radius: '8px', padded: true },
  },
  {
    id: 'quote-italic-only',
    label: '기울임만',
    description: '최소한의 인용 스타일',
    preview: { a: '#fff', b: '#94a3b8', c: '#334155' },
    tokens: { style: 'italic-only' as QuoteStyle },
  },
  {
    id: 'quote-pull',
    label: '풀 인용',
    description: '가운데 강조 인용',
    preview: { a: '#fef3c7', b: '#d97706', c: '#78350f' },
    tokens: { style: 'pull-quote' as QuoteStyle, fontSize: '1.15em' },
  },
  {
    id: 'quote-bordered',
    label: '점선 테두리',
    description: '점선으로 감싼 인용',
    preview: { a: '#fafafa', b: '#a3a3a3', c: '#262626' },
    tokens: { style: 'bordered-box' as QuoteStyle, radius: '4px', padded: true },
  },
];

export const DROP_CAP_STYLES: StyleCatalogEntry<ThemeDropCapTokens>[] = [
  {
    id: 'dropcap-classic',
    label: '클래식',
    description: '전통적인 큰 첫글자',
    preview: { a: '#fff', b: '#1e293b', c: '#64748b' },
    tokens: { style: 'classic' as DropCapStyle, size: '3.5em' },
  },
  {
    id: 'dropcap-boxed',
    label: '상자',
    description: '테두리 안 첫글자',
    preview: { a: '#eff6ff', b: '#2563eb', c: '#1e3a8a' },
    tokens: { style: 'boxed' as DropCapStyle, size: '3.2em' },
  },
  {
    id: 'dropcap-minimal',
    label: '미니멀',
    description: '담백한 크기만',
    preview: { a: '#fff', b: '#525252', c: '#a3a3a3' },
    tokens: { style: 'minimal' as DropCapStyle, size: '2.8em' },
  },
  {
    id: 'dropcap-ornate',
    label: '장식',
    description: '밑줄·그림자로 장식',
    preview: { a: '#fffef9', b: '#6b5b4f', c: '#c9b99a' },
    tokens: { style: 'ornate' as DropCapStyle, size: '3.8em' },
  },
  {
    id: 'dropcap-glow',
    label: '글로우',
    description: '은은한 빛 효과',
    preview: { a: '#0f172a', b: '#818cf8', c: '#e0e7ff' },
    tokens: { style: 'glow' as DropCapStyle, size: '3.5em' },
  },
  {
    id: 'dropcap-none',
    label: '사용 안 함',
    description: '첫글자 강조 없음',
    preview: { a: '#f8fafc', b: '#94a3b8', c: '#cbd5e1' },
    tokens: { style: 'none' as DropCapStyle },
  },
];

export const HR_STYLES: StyleCatalogEntry<ThemeHrTokens>[] = [
  {
    id: 'hr-solid',
    label: '실선',
    preview: { a: '#fff', b: '#cbd5e1', c: '#64748b' },
    tokens: { style: 'solid' as HrStyle },
  },
  {
    id: 'hr-dashed',
    label: '점선',
    preview: { a: '#fff', b: '#94a3b8', c: '#475569' },
    tokens: { style: 'dashed' as HrStyle },
  },
  {
    id: 'hr-dotted',
    label: '도트',
    preview: { a: '#fff', b: '#a3a3a3', c: '#525252' },
    tokens: { style: 'dotted' as HrStyle },
  },
  {
    id: 'hr-double',
    label: '이중선',
    preview: { a: '#fff', b: '#78716c', c: '#44403c' },
    tokens: { style: 'double' as HrStyle },
  },
  {
    id: 'hr-decorative',
    label: '장식',
    description: '◆ 장식 구분선',
    preview: { a: '#fbf0d9', b: '#8c7b64', c: '#5f4b32' },
    tokens: { style: 'decorative' as HrStyle },
  },
  {
    id: 'hr-accent-wide',
    label: '포인트 짧은 선',
    preview: { a: '#fff', b: '#3b82f6', c: '#1d4ed8' },
    tokens: { style: 'accent-wide' as HrStyle },
  },
];

export const FIGURE_STYLES: StyleCatalogEntry<
  Pick<ThemeFigureTokens, 'style' | 'captionAlign' | 'imageRadius'>
>[] = [
  {
    id: 'figure-plain',
    label: '기본',
    description: '단순한 가운데 정렬',
    preview: { a: '#fff', b: '#e2e8f0', c: '#64748b' },
    tokens: { style: 'plain' as FigureStyleId, captionAlign: 'center', imageRadius: '0' },
  },
  {
    id: 'figure-ruled',
    label: '선으로 감싸기',
    description: '위아래 가는 선',
    preview: { a: '#fff', b: '#94a3b8', c: '#334155' },
    tokens: { style: 'ruled' as FigureStyleId, captionAlign: 'center' },
  },
  {
    id: 'figure-shadow',
    label: '그림자',
    description: '이미지에 부드러운 그림자',
    preview: { a: '#f8fafc', b: '#cbd5e1', c: '#475569' },
    tokens: {
      style: 'shadow' as FigureStyleId,
      captionAlign: 'center',
      imageRadius: '6px',
    },
  },
  {
    id: 'figure-polaroid',
    label: '폴라로이드',
    description: '여백과 캡션이 있는 액자',
    preview: { a: '#fafafa', b: '#e5e5e5', c: '#525252' },
    tokens: {
      style: 'polaroid' as FigureStyleId,
      captionAlign: 'center',
      imageRadius: '2px',
    },
  },
  {
    id: 'figure-left-caption',
    label: '캡션 왼쪽',
    description: '캡션을 왼쪽에',
    preview: { a: '#fff', b: '#d4d4d8', c: '#3f3f46' },
    tokens: { style: 'plain' as FigureStyleId, captionAlign: 'left' },
  },
];

export const COMPONENT_CATALOGS = {
  table: TABLE_STYLES,
  infoBox: INFO_BOX_STYLES,
  quote: QUOTE_STYLES,
  dropCap: DROP_CAP_STYLES,
  hr: HR_STYLES,
  figure: FIGURE_STYLES,
} as const;

export type CatalogComponentKey = keyof typeof COMPONENT_CATALOGS;

export function findCatalogEntry(
  key: CatalogComponentKey,
  id: string | undefined,
) {
  if (!id) return undefined;
  return COMPONENT_CATALOGS[key].find((e) => e.id === id);
}

export function isValidCatalogId(
  key: CatalogComponentKey,
  id: string,
): boolean {
  return COMPONENT_CATALOGS[key].some((e) => e.id === id);
}

export function defaultTableStyleId(): TableStyleId {
  return 'table-simple';
}

export function defaultFigureStyleId(): FigureStyleId {
  return 'plain';
}
