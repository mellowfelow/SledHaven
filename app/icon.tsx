import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#111418',
          borderRadius: 6,
          border: '1.5px solid #9A6B3E',
          position: 'relative',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontFamily: 'Georgia, serif',
            fontWeight: 700,
            fontSize: 18,
            letterSpacing: '-0.02em',
            lineHeight: 1,
          }}
        >
          <span style={{ color: '#D2A97E', fontSize: 8, lineHeight: 0.9, marginBottom: 1 }}>
            ▲
          </span>
          <span>S</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
