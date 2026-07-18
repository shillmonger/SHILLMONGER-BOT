import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { botApiUrl } = body;

    console.log('Bot API URL:', botApiUrl);

    if (!botApiUrl) {
      return NextResponse.json(
        { error: 'Bot API URL is required' },
        { status: 400 }
      );
    }

    // This endpoint will call the Python bot's FastAPI endpoint
    const response = await fetch(`${botApiUrl}/api/telegram/groups`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Bot API response status:', response.status);

    if (!response.ok) {
      throw new Error('Failed to fetch groups from bot');
    }

    const data = await response.json();
    console.log('Bot API response data:', data);
    console.log('Groups in response:', data.groups);
    console.log('Groups length:', data.groups?.length);

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error fetching groups:', error);
    return NextResponse.json(
      { error: 'Failed to fetch groups from bot' },
      { status: 500 }
    );
  }
}
