import {ImageResponse} from 'next/og';

export const dynamic = 'force-static';

export const size = {width: 1200, height: 630};
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 50%, #3b82f6 100%)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <svg
          width="80"
          height="80"
          viewBox="0 0 100 100"
          style={{marginBottom: '24px'}}
        >
          <rect width="100" height="100" rx="16" fill="rgba(255,255,255,0.95)"/>
          <path d="M22 28h56v4H26zM22 36h52v4H26zM22 44h48v4H26zM22 52h44v4H26zM22 60h40v4H26z" fill="#2563eb" opacity="0.9"/>
          <path d="M36 68c-2 0-3 1-3 3v8c0 2 1 3 3 3h28c2 0 3-1 3-3v-8c0-2-1-3-3-3H36zm1 3h26v2H37v-2zm0 4h26v2H37v-2zm0 4h18v2H37v-2z" fill="#2563eb" opacity="0.7"/>
        </svg>
        <div
          style={{
            fontSize: '64px',
            fontWeight: 700,
            color: '#fff',
            letterSpacing: '-0.02em',
            marginBottom: '12px',
          }}
        >
          코딩 없이 하는 전자책 만들기
        </div>
        <div
          style={{
            fontSize: '32px',
            color: 'rgba(255,255,255,0.75)',
            fontWeight: 400,
            marginBottom: '8px',
          }}
        >
          ePub Studio
        </div>
        <div
          style={{
            fontSize: '22px',
            color: 'rgba(255,255,255,0.9)',
            fontWeight: 500,
          }}
        >
          무료 EPUB 3.0 온라인 에디터 · 부업 추천
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
