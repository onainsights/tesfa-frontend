import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const baseUrl = process.env.BASE_URL;
  if (!baseUrl) {
    return new Response(
      JSON.stringify({ error: 'URL not found' }),
      { status: 500 }
    );
  }
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Token ')) {
    return new Response(
      JSON.stringify({ error: 'Missing or invalid token' }),
      { status: 401 }
    );
  }
  const token = authHeader.split(' ')[1];
  const targetUrl = baseUrl.endsWith('/') ? `${baseUrl}queries/` : `${baseUrl}/queries/`;
  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        Authorization: `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      const errorText = await response.text();
      return new Response(
        JSON.stringify({ error: errorText }),
        { status: response.status }
      );
    }
    const result = await response.json();
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const baseUrl = process.env.BASE_URL;
  if (!baseUrl) {
    return new Response(
      JSON.stringify({ error: 'Server misconfigured' }),
      { status: 500 }
    );
  }
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Token ')) {
    return new Response(
      JSON.stringify({ error: 'Missing or invalid token' }),
      { status: 401 }
    );
  }
  const token = authHeader.split(' ')[1];
  const targetUrl = baseUrl.endsWith('/') ? `${baseUrl}queries/` : `${baseUrl}/queries/`;
  try {
    const body = await request.json();

    // Long timeout to allow BioGPT to load and RAG pipeline to complete
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 300000); // 5 minutes

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        Authorization: `Token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const result = await response.json();
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      return new Response(
        JSON.stringify({ error: 'Request timed out. The AI model is taking too long to respond. Please try again.' }),
        { status: 504 }
      );
    }
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500 }
    );
  }
}