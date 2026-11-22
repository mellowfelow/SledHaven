import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
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
          background: '#111418',
          borderRadius: 36,
          border: '6px solid #9A6B3E',
          color: '#FFFFFF',
          fontFamily: 'Georgia, serif',
        }}
      >
        <span style={{ color: '#D2A97E', fontSize: 34, lineHeight: 1, marginBottom: 4 }}>
          ▲
        </span>
        <span style={{ fontSize: 84, fontWeight: 700, lineHeight: 1 }}>S</span>
      </div>
    ),
    { ...size }
  );
}
