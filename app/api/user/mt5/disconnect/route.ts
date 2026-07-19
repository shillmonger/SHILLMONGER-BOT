import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import MT5Account from '@/models/MT5Account';

export async function POST(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
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

    // Update user's MT5 account status to disconnected
    const updatedAccount = await MT5Account.findOneAndUpdate(
      { 
        userId: decoded.userId,
        status: 'connected'
      },
      { 
        status: 'disconnected',
        disconnectedAt: new Date()
      },
      { new: true }
    );

    if (!updatedAccount) {
      return NextResponse.json(
        { error: 'No connected account found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        success: true,
        message: 'Account disconnected successfully'
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Disconnect MT5 account error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
