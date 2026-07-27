import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import MT5Account from '@/models/MT5Account';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params to get the id
    const { id } = await params;

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

    // Connect to MongoDB
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI!);
    }

    // Find the MT5 account
    const mt5Account = await MT5Account.findById(id);

    if (!mt5Account) {
      return NextResponse.json(
        { error: 'MT5 account not found' },
        { status: 404 }
      );
    }

    // Toggle canTrade status
    mt5Account.canTrade = !mt5Account.canTrade;
    await mt5Account.save();

    return NextResponse.json(
      { 
        message: 'canTrade status updated successfully',
        canTrade: mt5Account.canTrade 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Toggle canTrade error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
