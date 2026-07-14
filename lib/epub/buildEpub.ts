import type { BookState, Chapter } from '@/lib/types/book';
import { getResolvedThemeCss } from './resolveThemeTokens';
import { generateChapterDocument } from './generateChapter';
import {
  extractCoverImage,
  extractImagesFromHtml,
  type ExtractedImage,
} from './extractImages';
import { generateNav } from './generateNav';
import { generateOpf } from './generateOpf';
import { validateMetadataForExport } from './metadataValidation';

export interface EpubPackageFile {
  path: string;
  content: string | Uint8Array;
  compression?: 'STORE' | 'DEFLATE';
}

export interface EpubBuildResult {
  files: EpubPackageFile[];
  bookId: string;
}

function getChapterFilename(index: number): string {
  return `text/chapter${index + 1}.xhtml`;
}

export function prepareEpubPackage(bookState: BookState): EpubBuildResult {
  const bookId = crypto.randomUUID();
  const allImages: ExtractedImage[] = [];
  let imageIndex = 1;

  const coverImage = extractCoverImage(bookState.metadata.coverImage);
  if (coverImage) {
    allImages.push(coverImage);
  }

  const sortedChapters = [...bookState.chapters].sort(
    (a, b) => a.order - b.order,
  );

  const chapterFiles: { chapter: Chapter; path: string; content: string }[] =
    [];

  sortedChapters.forEach((chapter, index) => {
    const extracted = extractImagesFromHtml(chapter.content, imageIndex);
    imageIndex += extracted.images.length;
    allImages.push(...extracted.images);

    const path = `OEBPS/${getChapterFilename(index)}`;
    const content = generateChapterDocument(chapter, extracted.html);
    chapterFiles.push({ chapter, path, content });
  });

  const themeCss = getResolvedThemeCss(bookState);
  const navContent = generateNav(sortedChapters);
  const opfContent = generateOpf(bookState, sortedChapters, allImages, bookId);

  const files: EpubPackageFile[] = [
    {
      path: 'mimetype',
      content: 'application/epub+zip',
      compression: 'STORE',
    },
    {
      path: 'META-INF/container.xml',
      content: `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`,
    },
    { path: 'OEBPS/content.opf', content: opfContent },
    { path: 'OEBPS/nav.xhtml', content: navContent },
    { path: 'OEBPS/styles/style.css', content: themeCss },
    ...chapterFiles.map((cf) => ({
      path: cf.path,
      content: cf.content,
    })),
    ...allImages.map((img) => ({
      path: img.path,
      content: img.data,
    })),
  ];

  return { files, bookId };
}

export async function buildEpub(bookState: BookState): Promise<Blob> {
  const JSZip = (await import('jszip')).default;
  const { files } = prepareEpubPackage(bookState);
  const zip = new JSZip();

  const mimetypeFile = files.find((f) => f.path === 'mimetype');
  if (mimetypeFile && typeof mimetypeFile.content === 'string') {
    zip.file('mimetype', mimetypeFile.content, { compression: 'STORE' });
  }

  files
    .filter((f) => f.path !== 'mimetype')
    .forEach((file) => {
      zip.file(file.path, file.content);
    });

  return zip.generateAsync({
    type: 'blob',
    mimeType: 'application/epub+zip',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 },
  });
}

export function sanitizeFilename(title: string): string {
  return (
    title
      .trim()
      .replace(/[/\\:*?"<>|]/g, '')
      .replace(/\s+/g, '_') || 'my-book'
  );
}

export function validateBookForExport(bookState: BookState): string | null {
  const metadataError = validateMetadataForExport(bookState.metadata);
  if (metadataError) return metadataError;

  if (bookState.chapters.length === 0) {
    return '최소 1개의 장이 필요합니다.';
  }

  const sorted = [...bookState.chapters].sort((a, b) => a.order - b.order);
  for (const chapter of sorted) {
    if (!chapter.title.trim()) {
      return '모든 장에 제목을 입력해 주세요.';
    }
    const textContent = chapter.content.replace(/<[^>]*>/g, '').trim();
    if (!textContent) {
      return `"${chapter.title}" 장의 본문이 비어 있습니다.`;
    }
  }

  return null;
}

export async function downloadEpub(bookState: BookState): Promise<void> {
  const error = validateBookForExport(bookState);
  if (error) {
    throw new Error(error);
  }

  const blob = await buildEpub(bookState);
  const filename = `${sanitizeFilename(bookState.metadata.title)}.epub`;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
