import type { Chapter } from '@/lib/types/book';
import { convertToXhtml } from './convertToXhtml';
import { injectHeadingIds } from './extractHeadings';

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function generateChapterDocument(
  chapter: Chapter,
  bodyHtml: string,
): string {
  const title = escapeXml(chapter.title);
  const withIds = injectHeadingIds(bodyHtml);
  const xhtmlBody = convertToXhtml(withIds);

  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="ko">
<head>
  <title>${title}</title>
  <link rel="stylesheet" type="text/css" href="../styles/style.css"/>
</head>
<body>
  <h1 class="chapter-title">${title}</h1>
  ${xhtmlBody}
</body>
</html>`;
}
