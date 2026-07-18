import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Provider from '@/models/Provider';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { groupId } = body;

    if (!groupId) {
      return NextResponse.json(
        { error: 'Group ID is required' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI!);
    }

    // Delete provider
    const deletedProvider = await Provider.findOneAndDelete({ groupId });

    if (!deletedProvider) {
      return NextResponse.json(
        { error: 'Provider not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Provider removed successfully', provider: deletedProvider },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error removing provider:', error);
    return NextResponse.json(
      { error: 'Failed to remove provider' },
      { status: 500 }
    );
  }
}
