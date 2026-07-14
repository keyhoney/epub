import type { BookState } from '@/lib/types/book';
import {
  isValidIsbn,
  isValidPublishedDate,
} from './metadataValidation';

export interface ExportPreflightResult {
  blocker: string | null;
  warnings: string[];
  infos: string[];
}

export function runExportPreflight(bookState: BookState): ExportPreflightResult {
  const warnings: string[] = [];
  const infos: string[] = [];

  if (!bookState.metadata.title.trim()) {
    return {
      blocker: '책 제목을 입력해 주세요. 왼쪽 사이드바에서 수정할 수 있습니다.',
      warnings,
      infos,
    };
  }

  if (!bookState.metadata.author.trim()) {
    warnings.push('저자가 비어 있습니다.');
  }

  if (
    bookState.metadata.isbn.trim() &&
    !isValidIsbn(bookState.metadata.isbn)
  ) {
    warnings.push('ISBN 형식이 올바르지 않습니다.');
  }

  if (
    bookState.metadata.publishedDate.trim() &&
    !isValidPublishedDate(bookState.metadata.publishedDate)
  ) {
    warnings.push('발행일 형식이 올바르지 않습니다. (YYYY-MM-DD)');
  }

  if (
    bookState.metadata.series.trim() &&
    bookState.metadata.seriesIndex == null
  ) {
    warnings.push('시리즈명을 입력했다면 권수도 입력해 주세요.');
  }

  if (!bookState.metadata.coverImage) {
    warnings.push('표지 이미지가 없습니다. (권장)');
  }

  let missingAlt = 0;
  bookState.chapters.forEach((ch) => {
    const imgs = ch.content.matchAll(/<img\b[^>]*>/gi);
    for (const match of imgs) {
      const tag = match[0];
      const alt = tag.match(/alt\s*=\s*("([^"]*)"|'([^']*)')/i);
      const altVal = alt?.[2] ?? alt?.[3] ?? '';
      if (!altVal.trim()) missingAlt += 1;
    }
  });
  if (missingAlt > 0) {
    warnings.push(`대체 텍스트(alt)가 없는 이미지가 ${missingAlt}개 있습니다.`);
  }

  if (bookState.chapters.length <= 1) {
    infos.push('장이 1개뿐입니다. 필요하면 장을 더 추가해 보세요.');
  }

  return { blocker: null, warnings: [...warnings, ...infos], infos };
}
