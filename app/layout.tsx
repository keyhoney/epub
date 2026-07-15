import type {Metadata} from 'next';
import './globals.css';

const siteUrl = 'https://epub.howlearn.kr';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'ePub Studio — EPUB 3.0 온라인 에디터',
  description: '워드 프로세서처럼 직관적으로 전자책을 만들고 EPUB 3.0 파일로 다운로드하세요.',
  applicationName: 'ePub Studio',
  generator: 'Next.js',
  keywords: ['epub', 'epub 3.0', '전자책', '전자책 에디터', '온라인 에디터', 'e-book', 'ebook editor'],
  authors: [{name: 'ePub Studio'}],
  creator: 'ePub Studio',
  publisher: 'ePub Studio',
  formatDetection: {telephone: false},
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    siteName: 'ePub Studio',
    title: 'ePub Studio — EPUB 3.0 온라인 에디터',
    description: '워드 프로세서처럼 직관적으로 전자책을 만들고 EPUB 3.0 파일로 다운로드하세요.',
    url: siteUrl,
    images: [{url: '/opengraph-image', width: 1200, height: 630}],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ePub Studio — EPUB 3.0 온라인 에디터',
    description: '워드 프로세서처럼 직관적으로 전자책을 만들고 EPUB 3.0 파일로 다운로드하세요.',
    images: ['/opengraph-image'],
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="ko">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
