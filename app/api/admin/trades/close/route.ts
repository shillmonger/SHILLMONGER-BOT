import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const PYTHON_API_URL = process.env.PYTHON_API_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as {
      userId: string;
      email: string;
    };

    const body = await request.json();

    // Try to call Python backend to close trade (requires MT5 connection)
    try {
      const response = await fetch(`${PYTHON_API_URL}/api/trades/close`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });

      const data = await response.json();

      if (!response.ok) {
        return NextResponse.json(
          { error: data.error || 'Failed to close trade' },
          { status: response.status }
        );
      }

      return NextResponse.json(data, { status: 200 });
    } catch (fetchError) {
      // Python backend not available
      console.error('Python backend not available for closing trade:', fetchError);
      return NextResponse.json(
        { error: 'Python bot not running - cannot close trade. Please start the bot.' },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error('Close trade error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
