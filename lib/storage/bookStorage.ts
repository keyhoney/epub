import {
  type BookState,
  STORAGE_KEY,
  createDefaultBookState,
  normalizeBookState,
} from '@/lib/types/book';
import {
  CURRENT_BOOK_KEY,
  idbDelete,
  idbGet,
  idbSet,
} from '@/lib/storage/indexedDbStorage';

const LEGACY_KEY = 'pubforge_files';

function loadFromLocalStorage(): BookState | null {
  if (typeof window === 'undefined') return null;

  localStorage.removeItem(LEGACY_KEY);

  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return null;

  try {
    const parsed = JSON.parse(saved) as Partial<BookState>;
    if (!parsed.metadata || !Array.isArray(parsed.chapters)) {
      return null;
    }
    return normalizeBookState(parsed);
  } catch {
    return null;
  }
}

function saveToLocalStorage(state: BookState): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function clearLocalStorage(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(LEGACY_KEY);
}

/** 브라우저에 저장된 작업 불러오기 (IndexedDB 우선, localStorage 마이그레이션) */
export async function loadBookState(): Promise<BookState> {
  if (typeof window === 'undefined') {
    return createDefaultBookState();
  }

  try {
    const fromIdb = await idbGet<BookState>(CURRENT_BOOK_KEY);
    if (fromIdb?.metadata && Array.isArray(fromIdb.chapters)) {
      return normalizeBookState(fromIdb);
    }
  } catch {
    // IndexedDB 실패 시 localStorage로 폴백
  }

  const fromLocal = loadFromLocalStorage();
  if (fromLocal) {
    try {
      await idbSet(CURRENT_BOOK_KEY, fromLocal);
      clearLocalStorage();
    } catch {
      // 마이그레이션 실패해도 불러온 데이터는 사용
    }
    return fromLocal;
  }

  return createDefaultBookState();
}

/** 자동 저장 (IndexedDB, 실패 시 localStorage 폴백) */
export async function saveBookState(state: BookState): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    await idbSet(CURRENT_BOOK_KEY, state);
    clearLocalStorage();
    return;
  } catch (err) {
    const isQuota =
      err instanceof DOMException &&
      (err.name === 'QuotaExceededError' || err.code === 22);
    if (isQuota) {
      throw new Error(
        '브라우저 저장 공간이 부족합니다. 「작업 저장」으로 파일을 내려받아 주세요.',
      );
    }
  }

  try {
    saveToLocalStorage(state);
  } catch (err) {
    const isQuota =
      err instanceof DOMException &&
      (err.name === 'QuotaExceededError' || err.code === 22);
    if (isQuota) {
      throw new Error(
        '브라우저 저장 공간이 부족합니다. 「작업 저장」으로 파일을 내려받아 주세요.',
      );
    }
    throw err;
  }
}

export async function clearBookState(): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    await idbDelete(CURRENT_BOOK_KEY);
  } catch {
    // ignore
  }
  clearLocalStorage();
}
