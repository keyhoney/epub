export const READING_SPEED_CHARS_PER_MINUTE = 500;

export function countCharsWithoutSpaces(text: string): number {
  return text.replace(/\s/g, '').length;
}

export function estimateReadingMinutes(charCount: number): number {
  return Math.max(1, Math.ceil(charCount / READING_SPEED_CHARS_PER_MINUTE));
}

export function formatReadingTime(minutes: number): string {
  if (minutes < 60) return `약 ${minutes}분`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `약 ${h}시간 ${m}분` : `약 ${h}시간`;
}

export function getTextStats(html: string) {
  const text = html.replace(/<[^>]*>/g, '');
  const charsWithSpaces = text.length;
  const charsWithoutSpaces = countCharsWithoutSpaces(text);
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const readingMinutes = estimateReadingMinutes(charsWithoutSpaces);
  return {
    charsWithSpaces,
    charsWithoutSpaces,
    words,
    readingMinutes,
    readingTimeLabel: formatReadingTime(readingMinutes),
  };
}
