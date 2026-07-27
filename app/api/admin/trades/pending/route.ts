import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const PYTHON_API_URL = process.env.PYTHON_API_URL || 'http://localhost:8000';

export async function GET(request: NextRequest) {
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

    // Try to fetch from Python backend for pending orders (MT5 data)
    // Pending orders are not stored in MongoDB, only in MT5
    try {
      const response = await fetch(`${PYTHON_API_URL}/api/trades/pending`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });

      if (response.ok) {
        const data = await response.json();
        return NextResponse.json(data, { status: 200 });
      } else {
        // Python backend returned error, return empty pending orders
        console.log('Python backend error for pending orders, returning empty');
        return NextResponse.json({ 
          pending_orders: [],
          warning: 'Python bot not running - pending orders unavailable' 
        }, { status: 200 });
      }
    } catch (fetchError) {
      // Python backend not available, return empty pending orders
      console.log('Python backend not available for pending orders, returning empty');
      return NextResponse.json({ 
        pending_orders: [],
        warning: 'Python bot not running - pending orders unavailable' 
      }, { status: 200 });
    }
  } catch (error) {
    console.error('Get pending orders error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
