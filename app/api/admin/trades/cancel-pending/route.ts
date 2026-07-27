import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const PYTHON_API_URL = process.env.NEXT_PUBLIC_BOT_API_URL || 'http://localhost:8000';

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

    // Try to call Python backend to cancel pending order (requires MT5 connection)
    try {
      const response = await fetch(`${PYTHON_API_URL}/api/trades/cancel-pending`, {
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
          { error: data.error || 'Failed to cancel pending order' },
          { status: response.status }
        );
      }

      return NextResponse.json(data, { status: 200 });
    } catch (fetchError) {
      // Python backend not available
      console.error('Python backend not available for cancelling pending order:', fetchError);
      return NextResponse.json(
        { error: 'Python bot not running - cannot cancel order. Please start the bot.' },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error('Cancel pending order error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
