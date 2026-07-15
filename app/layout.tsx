import type {Metadata} from 'next';
import './globals.css';

const siteUrl = 'https://epub.howlearn.kr';
const title = '전자책 만들기 부업 | 무료 EPUB 3.0 온라인 에디터 - ePub Studio';
const description =
  '코딩 지식 없이 누구나 전자책을 만들 수 있는 무료 EPUB 3.0 온라인 에디터. 부업으로 전자책을 시작하거나 장 관리·라이브 미리보기·테마까지 지원. 회원가입 없이 바로 시작하세요.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  applicationName: 'ePub Studio',
  generator: 'Next.js',
  keywords: [
    '전자책 만들기',
    'epub 에디터',
    'epub 3.0',
    '무료 전자책 제작',
    '온라인 epub 편집',
    'ebook editor',
    '전자책',
    'epub 편집기',
    '전자책 제작',
    '전자책 부업',
    'epub 부업',
    '전자책 만들기 부업',
    '코딩 없이 전자책 만들기',
    '전자책 만들기 사이트',
  ],
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
    title,
    description,
    url: siteUrl,
    images: [{url: '/opengraph-image', width: 1200, height: 630}],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/opengraph-image'],
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'ePub Studio',
    url: siteUrl,
    description,
    applicationCategory: 'Multimedia',
    operatingSystem: 'All',
    browserRequirements: 'Requires JavaScript',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'KRW',
    },
    featureList: [
      'EPUB 3.0 전자책 제작',
      '장 관리',
      '라이브 미리보기',
      '테마 커스터마이징',
      '이미지 삽입',
      '각주 삽입',
      '표 편집',
    ],
    inLanguage: 'ko',
  };

  return (
    <html lang="ko">
      <body suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}
        />
        {children}
      </body>
    </html>
  );
}
