import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import Subscription from '@/models/Subscription';
import User from '@/models/User';

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

    // Connect to MongoDB
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI!);
    }

    // Check if user is admin
    // Note: You might want to add admin role check here
    // For now, we'll allow all authenticated users to access

    // Fetch all subscriptions with user data
    const subscriptions = await Subscription.find()
      .populate('userId', 'username email profileImage')
      .sort({ createdAt: -1 })
      .exec();

    return NextResponse.json(
      { subscriptions },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get subscriptions error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
