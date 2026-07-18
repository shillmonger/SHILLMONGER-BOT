import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import User from '@/models/User';

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

    // Get profile image from request body
    const body = await request.json();
    const { profileImage } = body;

    if (!profileImage) {
      return NextResponse.json(
        { error: 'Profile image is required' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI!);
    }

    // Update user's profile image
    const updatedUser = await User.findByIdAndUpdate(
      decoded.userId,
      { profileImage },
      { new: true }
    ).select('-password -verificationToken -verificationTokenExpires -resetPasswordToken -resetPasswordTokenExpires');

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update profile image error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
