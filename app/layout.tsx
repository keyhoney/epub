import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'ePub Studio — EPUB 3.0 온라인 에디터',
  description: '워드 프로세서처럼 직관적으로 전자책을 만들고 EPUB 3.0 파일로 다운로드하세요.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="ko">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
