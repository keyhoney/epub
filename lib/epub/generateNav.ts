import type { Chapter } from '@/lib/types/book';
import {
  buildNavHeadingTree,
  extractHeadings,
  type NavHeadingNode,
} from './extractHeadings';

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderHeadingNodes(
  nodes: NavHeadingNode[],
  chapterHref: string,
  indent: string,
): string {
  if (nodes.length === 0) return '';

  const items = nodes
    .map((node) => {
      const href = `${chapterHref}#${node.id}`;
      const label = escapeXml(node.text);
      const childOl =
        node.children && node.children.length > 0
          ? `\n${renderHeadingNodes(node.children, chapterHref, indent + '  ')}\n${indent}  `
          : '';
      if (childOl) {
        return `${indent}  <li><a href="${href}">${label}</a>\n${indent}  <ol>\n${childOl}</ol>\n${indent}  </li>`;
      }
      return `${indent}  <li><a href="${href}">${label}</a></li>`;
    })
    .join('\n');

  return `${indent}<ol>\n${items}\n${indent}</ol>`;
}

export function generateNav(chapters: Chapter[]): string {
  const sorted = [...chapters].sort((a, b) => a.order - b.order);

  const items = sorted
    .map((chapter, index) => {
      const href = `text/chapter${index + 1}.xhtml`;
      const label = escapeXml(chapter.title);
      const headings = buildNavHeadingTree(extractHeadings(chapter.content));
      const nested = renderHeadingNodes(headings, href, '      ');

      if (nested) {
        return `      <li><a href="${href}">${index + 1}장. ${label}</a>\n${nested}\n      </li>`;
      }
      return `      <li><a href="${href}">${index + 1}장. ${label}</a></li>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="ko">
<head>
  <title>목차</title>
  <link rel="stylesheet" type="text/css" href="styles/style.css"/>
</head>
<body>
  <nav epub:type="toc" id="toc">
    <h1>목차</h1>
    <ol>
${items}
    </ol>
  </nav>
</body>
</html>`;
}
