import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Provider from '@/models/Provider';

export async function GET() {
  try {
    // Connect to MongoDB
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI!);
    }

    // Get all providers
    const providers = await Provider.find({}).sort({ createdAt: -1 });

    return NextResponse.json({ providers }, { status: 200 });
  } catch (error) {
    console.error('Error fetching providers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch providers' },
      { status: 500 }
    );
  }
}
