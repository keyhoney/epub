import type { BookState, ThemeComponents } from '@/lib/types/book';
import {
  THEME_TOKEN_LIST,
  DEFAULT_THEME_ID,
  type ThemeTokens,
  type ThemeTableTokens,
  type ThemeFigureTokens,
  type ThemeColorTokens,
} from './themeTokens';
import {
  findCatalogEntry,
  isValidCatalogId,
  type CatalogComponentKey,
} from './styleCatalog';
import { buildThemeCss } from './themes';

function getBaseTokens(baseId: string): ThemeTokens {
  return (
    THEME_TOKEN_LIST.find((t) => t.id === baseId) ??
    THEME_TOKEN_LIST.find((t) => t.id === DEFAULT_THEME_ID) ??
    THEME_TOKEN_LIST[0]
  );
}

function fillTableColors(
  structural: Partial<ThemeTableTokens> & { style: ThemeTableTokens['style'] },
  colors: ThemeColorTokens,
): ThemeTableTokens {
  const softBg = colors.infoBg || colors.quoteBg;
  return {
    style: structural.style,
    radius: structural.radius ?? '0',
    cellPadding: structural.cellPadding ?? '0.5em 0.75em',
    fontSize: structural.fontSize,
    borderColor: structural.borderColor ?? colors.border,
    headerBg:
      structural.headerBg ??
      (structural.style === 'table-header-accent' ? colors.accent : softBg),
    headerText:
      structural.headerText ??
      (structural.style === 'table-header-accent' ? '#ffffff' : colors.heading),
    stripeBg: structural.stripeBg ?? softBg,
  };
}

function fillFigureDefaults(
  structural: Partial<ThemeFigureTokens> & { style: ThemeFigureTokens['style'] },
  colors: ThemeColorTokens,
): ThemeFigureTokens {
  return {
    style: structural.style,
    captionAlign: structural.captionAlign ?? 'center',
    captionSize: structural.captionSize ?? '0.85em',
    captionColor: structural.captionColor ?? colors.text,
    imageRadius: structural.imageRadius ?? '0',
  };
}

function sanitizeComponents(
  components?: ThemeComponents,
): ThemeComponents | undefined {
  if (!components) return undefined;
  const next: ThemeComponents = {};
  (Object.keys(components) as CatalogComponentKey[]).forEach((key) => {
    const id = components[key];
    if (id && isValidCatalogId(key, id)) {
      next[key] = id;
    }
  });
  return Object.keys(next).length ? next : undefined;
}

export type ResolvedThemeTokens = ThemeTokens & {
  table: ThemeTableTokens;
  figure: ThemeFigureTokens;
};

export function resolveThemeTokens(
  baseId: string,
  components?: ThemeComponents,
): ResolvedThemeTokens {
  const base = { ...getBaseTokens(baseId) };
  const safe = sanitizeComponents(components);

  const quoteEntry = findCatalogEntry('quote', safe?.quote);
  if (quoteEntry) {
    base.quote = {
      ...base.quote,
      ...(quoteEntry.tokens as ThemeTokens['quote']),
    };
  }

  const infoEntry = findCatalogEntry('infoBox', safe?.infoBox);
  if (infoEntry) {
    base.infoBox = {
      ...base.infoBox,
      ...(infoEntry.tokens as ThemeTokens['infoBox']),
    };
  }

  const dropEntry = findCatalogEntry('dropCap', safe?.dropCap);
  if (dropEntry) {
    base.dropCap = {
      ...base.dropCap,
      ...(dropEntry.tokens as ThemeTokens['dropCap']),
    };
  }

  const hrEntry = findCatalogEntry('hr', safe?.hr);
  if (hrEntry) {
    base.hr = { ...base.hr, ...(hrEntry.tokens as ThemeTokens['hr']) };
  }

  const tableEntry = findCatalogEntry('table', safe?.table);
  const tableStructural = (tableEntry?.tokens as Partial<ThemeTableTokens> | undefined) ??
    base.table ?? { style: 'table-simple' as const };
  const table = fillTableColors(
    {
      style: (tableStructural.style ?? 'table-simple') as ThemeTableTokens['style'],
      radius: tableStructural.radius,
      cellPadding: tableStructural.cellPadding,
      fontSize: tableStructural.fontSize,
    },
    base.colors,
  );

  const figureEntry = findCatalogEntry('figure', safe?.figure);
  const figureStructural = (figureEntry?.tokens as Partial<ThemeFigureTokens> | undefined) ??
    base.figure ?? { style: 'plain' as const, captionAlign: 'center' as const };
  const figure = fillFigureDefaults(
    {
      style: (figureStructural.style ?? 'plain') as ThemeFigureTokens['style'],
      captionAlign: figureStructural.captionAlign,
      imageRadius: figureStructural.imageRadius,
    },
    base.colors,
  );

  return { ...base, table, figure };
}

export function getResolvedThemeCss(bookState: Pick<BookState, 'readerThemeId' | 'themeComponents'>): string {
  const resolved = resolveThemeTokens(
    bookState.readerThemeId,
    bookState.themeComponents,
  );
  return buildThemeCss(resolved);
}
