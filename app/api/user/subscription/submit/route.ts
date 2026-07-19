import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';
import Subscription from '@/models/Subscription';

// Configure Cloudinary
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  console.error('Missing Cloudinary environment variables:', {
    cloudName: !!cloudName,
    apiKey: !!apiKey,
    apiSecret: !!apiSecret,
  });
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

export async function POST(request: NextRequest) {
  try {
    // Check Cloudinary configuration
    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        { error: 'Cloudinary configuration is missing. Please contact support.' },
        { status: 500 }
      );
    }

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

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('screenshot') as File;
    const planType = formData.get('planType') as string;
    const amount = formData.get('amount') as string;
    const accountSize = formData.get('accountSize') as string;
    const duration = formData.get('duration') as string;
    const lotSize = formData.get('lotSize') as string;
    const maxTrades = formData.get('maxTrades') as string;
    const targetLabel = formData.get('targetLabel') as string;
    const tradingVolume = formData.get('tradingVolume') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'Screenshot is required' },
        { status: 400 }
      );
    }

    // Check for existing subscription with same plan type
    const existingSubscription = await Subscription.findOne({
      userId: decoded.userId,
      planType: planType,
      status: { $in: ['pending', 'approved'] }
    });

    if (existingSubscription) {
      const statusMessage = existingSubscription.status === 'pending' 
        ? 'You already have a pending subscription for this plan type. Please wait for approval.' 
        : 'You already have an active subscription for this plan type.';
      
      return NextResponse.json(
        { error: statusMessage },
        { status: 400 }
      );
    }

    // If subscription exists but is expired or rejected, allow re-submission
    // (No additional check needed since we only block pending/approved)

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'subscription-screenshots',
          resource_type: 'image',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    const uploadResultTyped = uploadResult as any;

    // Calculate expiration date based on duration
    let expirationDate: Date;
    const now = new Date();
    
    if (duration === '5 Days') {
      expirationDate = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);
    } else if (duration === '14 Days') {
      expirationDate = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
    } else if (duration === '1 Month') {
      expirationDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    } else {
      expirationDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // Default to 1 month
    }

    // Create subscription
    const subscription = await Subscription.create({
      userId: decoded.userId,
      planType,
      amount: parseFloat(amount),
      accountSize,
      duration,
      lotSize,
      maxTrades: parseInt(maxTrades),
      targetLabel,
      tradingVolume,
      screenshotUrl: uploadResultTyped.secure_url,
      status: 'pending',
      startDate: now,
      expirationDate,
    });

    return NextResponse.json(
      { 
        success: true, 
        subscription,
        message: 'Subscription submitted successfully. Verification takes about 5 minutes.' 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Subscription submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
