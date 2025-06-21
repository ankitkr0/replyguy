import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import React from 'react';

export const runtime = 'edge';

// Function to calculate Reply Guy Score based on FID
function calculateReplyGuyScore(fid: number): { score: number; tier: string } {
  const score = (fid * 69) % 101;
  
  let tier: string;
  if (score >= 0 && score <= 20) {
    tier = "👻 Ghost Vibes";
  } else if (score >= 21 && score <= 60) {
    tier = "🤝 Mutual Enjoyer";
  } else if (score >= 61 && score <= 80) {
    tier = "🧎 Certified Reply Guy";
  } else {
    tier = "🚨 Terminal Cope Poster";
  }
  
  return { score, tier };
}

// GET handler for Frame metadata
export async function GET() {
  const frameMetadata = {
    'fc:frame': 'vNext',
    'fc:frame:image': `${process.env.VERCEL_URL || 'http://localhost:3000'}/api/frame`,
    'fc:frame:button:1': 'Check mine',
    'fc:frame:post_url': `${process.env.VERCEL_URL || 'http://localhost:3000'}/api/frame`,
  };

  return new Response(
    `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Reply Guy Score</title>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${frameMetadata['fc:frame:image']}" />
        <meta property="fc:frame:button:1" content="Check mine" />
        <meta property="fc:frame:post_url" content="${frameMetadata['fc:frame:post_url']}" />
      </head>
      <body>
        <h1>Reply Guy Score</h1>
        <p>Check your Reply Guy Score based on your FID!</p>
      </body>
    </html>
    `,
    {
      headers: {
        'Content-Type': 'text/html',
      },
    }
  );
}

// POST handler for generating the OG image
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const fid = body?.untrustedData?.fid || 1; // Default to 1 if no FID provided
    
    const { score, tier } = calculateReplyGuyScore(fid);
    
    const element = React.createElement(
      'div',
      {
        style: {
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'black',
          color: 'white',
          fontFamily: 'Impact, sans-serif',
          padding: '40px',
        },
      },
      React.createElement(
        'div',
        {
          style: {
            fontSize: '48px',
            fontWeight: 'bold',
            marginBottom: '20px',
            textAlign: 'center',
          },
        },
        'REPLY GUY SCORE'
      ),
      React.createElement(
        'div',
        {
          style: {
            fontSize: '120px',
            fontWeight: 'bold',
            marginBottom: '30px',
            color: '#FFD700',
          },
        },
        score
      ),
      React.createElement(
        'div',
        {
          style: {
            fontSize: '36px',
            marginBottom: '40px',
            textAlign: 'center',
          },
        },
        tier
      ),
      React.createElement(
        'div',
        {
          style: {
            fontSize: '20px',
            color: '#888',
            textAlign: 'center',
            fontStyle: 'italic',
          },
        },
        'based on absolutely no data. just vibes.'
      )
    );
    
    return new ImageResponse(element, {
      width: 1200,
      height: 630,
    });
  } catch (error) {
    console.error('Error generating image:', error);
    return new Response('Error generating image', { status: 500 });
  }
} 