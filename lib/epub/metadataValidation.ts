export function normalizeIsbn(raw: string): string {
  return raw.replace(/[-\s]/g, '');
}

export function isValidIsbn(isbn: string): boolean {
  const cleaned = normalizeIsbn(isbn);
  if (cleaned.length === 10) return isValidIsbn10(cleaned);
  if (cleaned.length === 13) return isValidIsbn13(cleaned);
  return false;
}

function isValidIsbn10(isbn: string): boolean {
  if (!/^\d{9}[\dX]$/.test(isbn)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(isbn[i], 10) * (10 - i);
  }
  const check = isbn[9] === 'X' ? 10 : parseInt(isbn[9], 10);
  return (sum + check) % 11 === 0;
}

function isValidIsbn13(isbn: string): boolean {
  if (!/^\d{13}$/.test(isbn)) return false;
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(isbn[i], 10) * (i % 2 === 0 ? 1 : 3);
  }
  const check = (10 - (sum % 10)) % 10;
  return check === parseInt(isbn[12], 10);
}

export function isValidPublishedDate(date: string): boolean {
  if (!date.trim()) return true;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const parsed = new Date(date);
  return !Number.isNaN(parsed.getTime());
}

export function validateMetadataForExport(metadata: {
  title: string;
  author: string;
  isbn: string;
  publishedDate: string;
  series: string;
  seriesIndex: number | null;
}): string | null {
  if (!metadata.title.trim()) {
    return '책 제목을 입력해 주세요.';
  }
  if (!metadata.author.trim()) {
    return '저자를 입력해 주세요.';
  }
  if (metadata.isbn.trim() && !isValidIsbn(metadata.isbn)) {
    return 'ISBN 형식이 올바르지 않습니다. (ISBN-10 또는 ISBN-13)';
  }
  if (metadata.publishedDate.trim() && !isValidPublishedDate(metadata.publishedDate)) {
    return '발행일 형식이 올바르지 않습니다. (YYYY-MM-DD)';
  }
  if (metadata.series.trim() && metadata.seriesIndex == null) {
    return '시리즈명을 입력했다면 권수도 입력해 주세요.';
  }
  return null;
}
