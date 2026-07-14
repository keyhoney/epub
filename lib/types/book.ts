import {
  DEFAULT_THEME_ID,
  isValidThemeId,
} from '@/lib/epub/themeTokens';

export type ReaderThemeId = string;

export type ContributorRole =
  | 'author'
  | 'translator'
  | 'editor'
  | 'illustrator'
  | 'other';

export interface Contributor {
  id: string;
  role: ContributorRole;
  name: string;
}

export interface Chapter {
  id: string;
  title: string;
  content: string;
  order: number;
}

export interface BookMetadata {
  title: string;
  subtitle: string;
  author: string;
  language: string;
  description: string;
  coverImage: string | null;
  publisher: string;
  publishedDate: string;
  isbn: string;
  contributors: Contributor[];
  subjects: string[];
  series: string;
  seriesIndex: number | null;
  copyright: string;
  rights: string;
}

export type ThemeComponentKey =
  | 'table'
  | 'infoBox'
  | 'quote'
  | 'dropCap'
  | 'hr'
  | 'figure';

export type ThemeComponents = Partial<Record<ThemeComponentKey, string>>;

export interface BookState {
  metadata: BookMetadata;
  chapters: Chapter[];
  readerThemeId: ReaderThemeId;
  themeComponents?: ThemeComponents;
}

export const STORAGE_KEY = 'epub_editor_book_state';
export const PROJECT_FILE_FORMAT_VERSION = 2;

export interface SavedProjectFile {
  formatVersion: number;
  app: 'epub-studio';
  savedAt: string;
  bookState: BookState;
}

export const LANGUAGE_OPTIONS = [
  { value: 'ko', label: '한국어' },
  { value: 'en', label: 'English' },
  { value: 'ja', label: '日本語' },
  { value: 'zh', label: '中文' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
] as const;

export const CONTRIBUTOR_ROLE_OPTIONS: {
  value: ContributorRole;
  label: string;
}[] = [
  { value: 'translator', label: '역자' },
  { value: 'editor', label: '편집자' },
  { value: 'illustrator', label: '일러스트' },
  { value: 'other', label: '기타' },
];

export function createDefaultMetadata(): BookMetadata {
  return {
    title: '나의 멋진 책',
    subtitle: '',
    author: '',
    language: 'ko',
    description: '',
    coverImage: null,
    publisher: '',
    publishedDate: '',
    isbn: '',
    contributors: [],
    subjects: [],
    series: '',
    seriesIndex: null,
    copyright: '',
    rights: '',
  };
}

export function createDefaultBookState(): BookState {
  const chapterId = crypto.randomUUID();
  return {
    metadata: createDefaultMetadata(),
    chapters: [
      {
        id: chapterId,
        title: '서문',
        order: 0,
        content: `<p class="drop-cap"><span class="first-letter">E</span>PUB 3.0 온라인 에디터에 오신 것을 환영합니다. 워드 프로세서처럼 직관적으로 전자책을 작성하고, 실시간 미리보기로 결과를 확인할 수 있습니다.</p>
<aside class="info-box">
  <h2>안내</h2>
  <p>툴바의 블록 삽입 메뉴로 드롭 캡, 정보 박스 등을 한 번에 추가할 수 있습니다.</p>
</aside>
<p>이제 여러분만의 멋진 이야기를 시작해 보세요.</p>`,
      },
    ],
    readerThemeId: DEFAULT_THEME_ID,
    themeComponents: {},
  };
}

export function normalizeBookState(parsed: Partial<BookState>): BookState {
  const defaults = createDefaultBookState();
  const metadata = {
    ...defaults.metadata,
    ...parsed.metadata,
    contributors: Array.isArray(parsed.metadata?.contributors)
      ? parsed.metadata.contributors
      : defaults.metadata.contributors,
    subjects: Array.isArray(parsed.metadata?.subjects)
      ? parsed.metadata.subjects
      : defaults.metadata.subjects,
  };

  const chapters =
    Array.isArray(parsed.chapters) && parsed.chapters.length > 0
      ? parsed.chapters
      : defaults.chapters;

  const readerThemeId =
    parsed.readerThemeId && isValidThemeId(parsed.readerThemeId)
      ? parsed.readerThemeId
      : DEFAULT_THEME_ID;

  const themeComponents =
    parsed.themeComponents && typeof parsed.themeComponents === 'object'
      ? { ...parsed.themeComponents }
      : undefined;

  return { metadata, chapters, readerThemeId, themeComponents };
}
