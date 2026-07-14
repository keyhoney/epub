import {
  type BookState,
  type SavedProjectFile,
  PROJECT_FILE_FORMAT_VERSION,
  normalizeBookState,
} from '@/lib/types/book';

const ACCEPTED_EXTENSIONS = ['.epubstudio.json', '.json'];

export function createSavedProjectFile(bookState: BookState): SavedProjectFile {
  return {
    formatVersion: PROJECT_FILE_FORMAT_VERSION,
    app: 'epub-studio',
    savedAt: new Date().toISOString(),
    bookState,
  };
}

export function parseSavedProjectFile(raw: string): BookState {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error('파일 형식이 올바르지 않습니다. JSON 파일인지 확인해 주세요.');
  }

  if (!parsed || typeof parsed !== 'object') {
    throw new Error('프로젝트 파일을 읽을 수 없습니다.');
  }

  const file = parsed as Partial<SavedProjectFile>;

  if (file.app === 'epub-studio' && file.bookState) {
    if (!file.bookState.metadata || !Array.isArray(file.bookState.chapters)) {
      throw new Error('프로젝트 데이터가 손상되었습니다.');
    }
    return normalizeBookState(file.bookState);
  }

  // 이전 버전: BookState만 저장된 JSON 호환
  const legacy = parsed as Partial<BookState>;
  if (legacy.metadata && Array.isArray(legacy.chapters)) {
    return normalizeBookState(legacy);
  }

  throw new Error(
    'ePub Studio 프로젝트 파일이 아닙니다. .epubstudio.json 파일을 선택해 주세요.',
  );
}

export function projectDownloadFilename(bookState: BookState): string {
  const base =
    bookState.metadata.title.trim().replace(/[<>:"/\\|?*\n\r]/g, '_') ||
    'epub-project';
  const date = new Date().toISOString().slice(0, 10);
  return `${base.slice(0, 60)}_${date}.epubstudio.json`;
}

export function downloadProjectFile(bookState: BookState): void {
  const payload = createSavedProjectFile(bookState);
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: 'application/json;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = projectDownloadFilename(bookState);
  anchor.click();
  URL.revokeObjectURL(url);
}

export async function readProjectFile(file: File): Promise<BookState> {
  const name = file.name.toLowerCase();
  const hasValidExt = ACCEPTED_EXTENSIONS.some((ext) => name.endsWith(ext));
  if (!hasValidExt && file.type && !file.type.includes('json')) {
    throw new Error('JSON 프로젝트 파일만 불러올 수 있습니다.');
  }

  const text = await file.text();
  return parseSavedProjectFile(text);
}
