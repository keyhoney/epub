export const MIME_TYPES: Record<string, string> = {
  aac: 'audio/aac',
  abw: 'application/x-abiword',
  apng: 'image/apng',
  arc: 'application/x-freearc',
  avif: 'image/avif',
  avi: 'video/x-msvideo',
  azw: 'application/vnd.amazon.ebook',
  bin: 'application/octet-stream',
  bmp: 'image/bmp',
  bz: 'application/x-bzip',
  bz2: 'application/x-bzip2',
  csh: 'application/x-csh',
  css: 'text/css',
  csv: 'text/csv',
  cur: 'image/x-icon',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  eot: 'application/vnd.ms-fontobject',
  epub: 'application/epub+zip',
  flac: 'audio/flac',
  gif: 'image/gif',
  gz: 'application/gzip',
  heic: 'image/heic',
  heif: 'image/heif',
  htm: 'text/html',
  html: 'text/html',
  hwp: 'application/x-hwp',
  hwpx: 'application/vnd.hancom.hwpx',
  ico: 'image/vnd.microsoft.icon',
  ics: 'text/calendar',
  indd: 'application/x-indesign',
  jar: 'application/java-archive',
  jfif: 'image/jpeg',
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
  js: 'text/javascript',
  json: 'application/json',
  jsonld: 'application/ld+json',
  m4a: 'audio/mp4',
  md: 'text/markdown',
  mid: 'audio/midi',
  midi: 'audio/midi',
  mjs: 'text/javascript',
  mkv: 'video/x-matroska',
  mp3: 'audio/mpeg',
  mp4: 'video/mp4',
  mpeg: 'video/mpeg',
  mpkg: 'application/vnd.apple.installer+xml',
  ncx: 'application/x-dtbncx+xml',
  odp: 'application/vnd.oasis.opendocument.presentation',
  ods: 'application/vnd.oasis.opendocument.spreadsheet',
  odt: 'application/vnd.oasis.opendocument.text',
  oga: 'audio/ogg',
  ogg: 'audio/ogg',
  ogv: 'video/ogg',
  ogx: 'application/ogg',
  opf: 'application/oebps-package+xml',
  opus: 'audio/opus',
  otf: 'font/otf',
  pdf: 'application/pdf',
  php: 'application/x-httpd-php',
  pjp: 'image/jpeg',
  pjpeg: 'image/jpeg',
  png: 'image/png',
  ppt: 'application/vnd.ms-powerpoint',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  psd: 'image/vnd.adobe.photoshop',
  rar: 'application/vnd.rar',
  rtf: 'application/rtf',
  sh: 'application/x-sh',
  svg: 'image/svg+xml',
  swf: 'application/x-shockwave-flash',
  tar: 'application/x-tar',
  tif: 'image/tiff',
  tiff: 'image/tiff',
  ts: 'video/mp2t',
  ttf: 'font/ttf',
  txt: 'text/plain',
  vsd: 'application/vnd.visio',
  wav: 'audio/wav',
  weba: 'audio/webm',
  webm: 'video/webm',
  webp: 'image/webp',
  woff: 'font/woff',
  woff2: 'font/woff2',
  xhtml: 'application/xhtml+xml',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  xml: 'application/xml',
  xul: 'application/vnd.mozilla.xul+xml',
  zip: 'application/zip',
  '3gp': 'video/3gpp',
  '3g2': 'video/3gpp2',
  '7z': 'application/x-7z-compressed',
};

export const MIME_TYPE_TO_EXT: Record<string, string> = Object.fromEntries(
  Object.entries(MIME_TYPES).map(([ext, mime]) => [mime, ext]),
);

export function getMimeType(extension: string): string {
  return MIME_TYPES[extension.toLowerCase().replace(/^\./, '')] ?? 'application/octet-stream';
}

export function getExtension(mimeType: string): string | undefined {
  return MIME_TYPE_TO_EXT[mimeType.toLowerCase()];
}

const IMAGE_MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'image/avif': 'avif',
  'image/bmp': 'bmp',
  'image/svg+xml': 'svg',
  'image/tiff': 'tiff',
  'image/heic': 'heic',
  'image/heif': 'heif',
  'image/apng': 'apng',
};

export function getImageExtension(mimeType: string): string {
  return IMAGE_MIME_TO_EXT[mimeType.toLowerCase()] ?? 'png';
}

export function getExtensionFromMimeSub(mimeSub: string): string {
  const mime =
    mimeSub.startsWith('image/') ? mimeSub : `image/${mimeSub}`;
  return getImageExtension(mime);
}

export function isImageMimeType(mimeType: string): boolean {
  return mimeType.startsWith('image/');
}

export function isFontMimeType(mimeType: string): boolean {
  return mimeType.startsWith('font/') || mimeType === 'application/vnd.ms-fontobject';
}
