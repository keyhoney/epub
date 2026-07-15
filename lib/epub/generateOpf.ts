import type { BookMetadata, Chapter, ContributorRole } from '@/lib/types/book';
import type { ExtractedImage } from './extractImages';
import { normalizeIsbn } from './metadataValidation';
import { MIME_TYPES, getMimeType } from './mimeTypes';

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function getModifiedDate(): string {
  return new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
}

function formatTitle(metadata: BookMetadata): string {
  if (metadata.subtitle.trim()) {
    return `${metadata.title.trim()}: ${metadata.subtitle.trim()}`;
  }
  return metadata.title.trim();
}

function formatRights(metadata: BookMetadata): string {
  const parts = [metadata.copyright.trim(), metadata.rights.trim()].filter(
    Boolean,
  );
  return parts.join('\n');
}

const MARC_RELATOR: Record<ContributorRole, string> = {
  author: 'aut',
  translator: 'trl',
  editor: 'edt',
  illustrator: 'ill',
  other: 'oth',
};

export function generateOpf(
  bookState: { metadata: BookMetadata },
  chapters: Chapter[],
  images: ExtractedImage[],
  bookId: string,
): string {
  const { metadata } = bookState;
  const sorted = [...chapters].sort((a, b) => a.order - b.order);
  const modified = getModifiedDate();

  let metadataXml = `    <dc:title>${escapeXml(formatTitle(metadata))}</dc:title>
    <dc:creator id="main-creator">${escapeXml(metadata.author)}</dc:creator>
    <meta refines="#main-creator" property="role" scheme="marc:relators">${MARC_RELATOR.author}</meta>
    <dc:language>${escapeXml(metadata.language || 'ko')}</dc:language>
    <dc:identifier id="pub-id">urn:uuid:${bookId}</dc:identifier>
    <meta property="dcterms:modified">${modified}</meta>`;

  if (metadata.publisher.trim()) {
    metadataXml += `\n    <dc:publisher>${escapeXml(metadata.publisher)}</dc:publisher>`;
  }
  if (metadata.description.trim()) {
    metadataXml += `\n    <dc:description>${escapeXml(metadata.description)}</dc:description>`;
  }
  if (metadata.publishedDate.trim()) {
    metadataXml += `\n    <dc:date>${escapeXml(metadata.publishedDate)}</dc:date>`;
  }
  if (metadata.isbn.trim()) {
    const isbn = normalizeIsbn(metadata.isbn);
    metadataXml += `\n    <dc:identifier id="isbn-id">urn:isbn:${escapeXml(isbn)}</dc:identifier>`;
  }

  metadata.subjects.forEach((subject) => {
    if (subject.trim()) {
      metadataXml += `\n    <dc:subject>${escapeXml(subject.trim())}</dc:subject>`;
    }
  });

  const rightsText = formatRights(metadata);
  if (rightsText) {
    metadataXml += `\n    <dc:rights>${escapeXml(rightsText)}</dc:rights>`;
  }

  metadata.contributors.forEach((contributor, index) => {
    if (!contributor.name.trim()) return;
    const id = `contributor-${index + 1}`;
    metadataXml += `\n    <dc:creator id="${id}">${escapeXml(contributor.name.trim())}</dc:creator>`;
    metadataXml += `\n    <meta refines="#${id}" property="role" scheme="marc:relators">${MARC_RELATOR[contributor.role]}</meta>`;
  });

  if (metadata.series.trim()) {
    metadataXml += `\n    <meta property="belongs-to-collection" id="series-id">${escapeXml(metadata.series.trim())}</meta>`;
    metadataXml += `\n    <meta refines="#series-id" property="collection-type">series</meta>`;
    if (metadata.seriesIndex != null) {
      metadataXml += `\n    <meta property="group-position">${metadata.seriesIndex}</meta>`;
    }
  }

  const hasCover = images.some((img) => img.id === 'cover-image');
  if (hasCover) {
    metadataXml += `\n    <meta name="cover" content="cover-image"/>`;
  }

  let manifestXml = `    <item id="nav" href="nav.xhtml" media-type="${MIME_TYPES.xhtml}" properties="nav"/>
    <item id="style" href="styles/style.css" media-type="${MIME_TYPES.css}"/>`;

  sorted.forEach((_, index) => {
    const id = `chapter${index + 1}`;
    const href = `text/chapter${index + 1}.xhtml`;
    manifestXml += `\n    <item id="${id}" href="${href}" media-type="${MIME_TYPES.xhtml}"/>`;
  });

  images.forEach((img) => {
    const properties =
      img.id === 'cover-image' ? ` properties="cover-image"` : '';
    const mime = img.mediaType || getMimeType(img.href.split('.').pop() ?? '');
    manifestXml += `\n    <item id="${img.id}" href="${img.href}" media-type="${mime}"${properties}/>`;
  });

  let spineXml = '';
  sorted.forEach((_, index) => {
    spineXml += `    <itemref idref="chapter${index + 1}"/>\n`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="pub-id" xml:lang="${escapeXml(metadata.language || 'ko')}">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
${metadataXml}
  </metadata>
  <manifest>
${manifestXml}
  </manifest>
  <spine>
${spineXml}  </spine>
</package>`;
}
