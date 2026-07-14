const VOID_ELEMENTS = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
]);

const FORBIDDEN_TAGS = new Set(['script', 'iframe', 'object', 'embed', 'style']);

function escapeXmlText(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeXmlAttribute(value: string): string {
  return escapeXmlText(value).replace(/"/g, '&quot;');
}

function serializeNode(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) {
    return escapeXmlText(node.textContent ?? '');
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return '';
  }

  const el = node as Element;
  const tag = el.tagName.toLowerCase();

  if (FORBIDDEN_TAGS.has(tag)) {
    return '';
  }

  const attrs = Array.from(el.attributes)
    .map((attr) => `${attr.name}="${escapeXmlAttribute(attr.value)}"`)
    .join(' ');

  const attrPart = attrs ? ` ${attrs}` : '';
  const children = Array.from(el.childNodes).map(serializeNode).join('');

  if (VOID_ELEMENTS.has(tag)) {
    return `<${tag}${attrPart}/>`;
  }

  return `<${tag}${attrPart}>${children}</${tag}>`;
}

export function convertToXhtml(html: string): string {
  if (!html.trim()) {
    return '';
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(`<div>${html}</div>`, 'text/html');
  const wrapper = doc.body.firstElementChild;

  if (!wrapper) {
    return '';
  }

  return Array.from(wrapper.childNodes).map(serializeNode).join('');
}
