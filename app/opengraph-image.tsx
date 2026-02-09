import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpengraphImage() {
  const logoResponse = await fetch(new URL('../public/aguila.png', import.meta.url));
  const logoBuffer = await logoResponse.arrayBuffer();

  return new ImageResponse(
    (
      // eslint-disable-next-line @next/next/no-img-element
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0b0b0b 0%, #151022 60%, #1b1030 100%)',
          color: 'white',
          padding: 64,
          fontFamily: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <img
            src={logoBuffer as unknown as string}
            width={64}
            height={64}
            alt="DPUXLABS"
            style={{ borderRadius: 12 }}
          />
          <div
            style={{
              display: 'inline-flex',
              gap: 12,
              alignItems: 'center',
              background: 'rgba(139, 92, 246, 0.12)',
              border: '1px solid rgba(139, 92, 246, 0.4)',
              padding: '6px 12px',
              borderRadius: 9999,
              fontSize: 24,
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 9999,
                background: '#8b5cf6',
                boxShadow: '0 0 16px #8b5cf6',
              }}
            />
            DPUXLABS SpA
          </div>
        </div>
        <div style={{ height: 28 }} />
        <h1 style={{ fontSize: 72, lineHeight: 1.05, margin: 0 }}>
          Purple-team Cybersecurity & AI Automation
        </h1>
        <p style={{ fontSize: 30, marginTop: 18, color: '#c7c7d1', maxWidth: 960 }}>
          AWS Cloud/DevOps • Data Integration • Peru & Mexico
        </p>
        <p style={{ fontSize: 22, marginTop: 22, color: '#a2a2b3' }}>
          dpuxlabs.cl
        </p>
      </div>
    ),
    { ...size }
  );
}

