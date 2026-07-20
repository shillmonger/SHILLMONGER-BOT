import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import User from '@/models/User';
import crypto from 'crypto';

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

    // Connect to MongoDB
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI!);
    }

    // Find user
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Generate secure random token
    const telegramToken = crypto.randomBytes(32).toString('hex');
    
    // Set token expiration (15 minutes)
    const tokenExpires = new Date(Date.now() + 15 * 60 * 1000);

    // Save token to user document
    user.telegram_token = telegramToken;
    user.telegram_token_expires = tokenExpires;
    await user.save();

    return NextResponse.json({
      success: true,
      token: telegramToken,
    });

  } catch (error) {
    console.error('Error generating Telegram token:', error);
    return NextResponse.json(
      { error: 'Failed to generate token' },
      { status: 500 }
    );
  }
}
