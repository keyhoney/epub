export interface ExtractedHeading {
  id: string;
  level: 2 | 3;
  text: string;
}

export function slugifyHeading(text: string, index: number, parentIndex?: number): string {
  const base = text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\u3131-\uD79D-]/g, '')
    .slice(0, 40);
  if (parentIndex !== undefined) {
    return base ? `section-${parentIndex}-${index}-${base}` : `section-${parentIndex}-${index}`;
  }
  return base ? `section-${index}-${base}` : `section-${index}`;
}

/** Parse h2/h3 from chapter HTML and assign stable ids */
export function extractHeadings(html: string): ExtractedHeading[] {
  if (!html.trim()) return [];

  const parser = new DOMParser();
  const doc = parser.parseFromString(`<div>${html}</div>`, 'text/html');
  const root = doc.body.firstElementChild;
  if (!root) return [];

  const headings: ExtractedHeading[] = [];
  let h2Count = 0;
  let h3Count = 0;

  root.querySelectorAll('h2, h3').forEach((el) => {
    const level = el.tagName === 'H2' ? 2 : 3;
    const text = el.textContent?.trim() ?? '';
    if (!text) return;

    let id = el.getAttribute('id') ?? '';
    if (!id) {
      if (level === 2) {
        h2Count += 1;
        h3Count = 0;
        id = slugifyHeading(text, h2Count);
      } else {
        h3Count += 1;
        id = slugifyHeading(text, h3Count, h2Count || 1);
      }
    } else if (level === 2) {
      h2Count += 1;
      h3Count = 0;
    } else {
      h3Count += 1;
    }

    headings.push({ id, level, text });
  });

  return headings;
}

/** Inject missing id attributes into h2/h3 elements */
export function injectHeadingIds(html: string): string {
  if (!html.trim()) return html;

  const parser = new DOMParser();
  const doc = parser.parseFromString(`<div>${html}</div>`, 'text/html');
  const root = doc.body.firstElementChild;
  if (!root) return html;

  let h2Idx = 0;
  let h3Idx = 0;

  root.querySelectorAll('h2, h3').forEach((el) => {
    if (el.getAttribute('id')) return;
    const level = el.tagName === 'H2' ? 2 : 3;
    const text = el.textContent?.trim() ?? '';
    if (level === 2) {
      h2Idx += 1;
      h3Idx = 0;
      el.setAttribute('id', slugifyHeading(text, h2Idx));
    } else {
      h3Idx += 1;
      el.setAttribute('id', slugifyHeading(text, h3Idx, h2Idx || 1));
    }
  });

  return root.innerHTML;
}

export interface NavHeadingNode {
  id: string;
  text: string;
  level: 2 | 3;
  children?: NavHeadingNode[];
}

export function buildNavHeadingTree(headings: ExtractedHeading[]): NavHeadingNode[] {
  const tree: NavHeadingNode[] = [];
  let currentH2: NavHeadingNode | null = null;

  for (const h of headings) {
    const node: NavHeadingNode = { id: h.id, text: h.text, level: h.level };
    if (h.level === 2) {
      currentH2 = { ...node, children: [] };
      tree.push(currentH2);
    } else if (currentH2) {
      currentH2.children = currentH2.children ?? [];
      currentH2.children.push(node);
    } else {
      tree.push(node);
    }
  }

  return tree;
}
