import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0b0b0b',
          borderRadius: 8,
        }}
      >
        <div
          style={{
            width: 16,
            height: 16,
            borderRadius: 9999,
            background: '#8b5cf6',
            boxShadow: '0 0 14px #8b5cf6',
          }}
        />
      </div>
    ),
    { ...size }
  );
}

