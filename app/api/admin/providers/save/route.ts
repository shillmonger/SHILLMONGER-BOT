import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Provider from '@/models/Provider';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { groupId, groupName, profileImage } = body;

    if (!groupId || !groupName) {
      return NextResponse.json(
        { error: 'Group ID and Group Name are required' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI!);
    }

    // Check if provider already exists
    const existingProvider = await Provider.findOne({ groupId });

    if (existingProvider) {
      return NextResponse.json(
        { error: 'Provider already exists' },
        { status: 409 }
      );
    }

    // Create new provider
    const provider = await Provider.create({
      groupId,
      groupName,
      profileImage: profileImage || '',
      isActive: true,
    });

    return NextResponse.json(
      { message: 'Provider saved successfully', provider },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error saving provider:', error);
    return NextResponse.json(
      { error: 'Failed to save provider' },
      { status: 500 }
    );
  }
}
