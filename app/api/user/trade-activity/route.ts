import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import jwt from 'jsonwebtoken';

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
    const client = new MongoClient(process.env.MONGODB_URI!);
    await client.connect();
    const db = client.db();
    const tradeActivityCollection = db.collection('trade_activity');

    // Get query parameters for pagination/filtering
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = parseInt(searchParams.get('skip') || '0');

    // Fetch trade activities for the user, sorted by creation date (newest first)
    const tradeActivities = await tradeActivityCollection
      .find({ user_id: decoded.userId })
      .sort({ created_at: -1 })
      .limit(limit)
      .skip(skip)
      .toArray();

    // Get total count for pagination
    const totalCount = await tradeActivityCollection.countDocuments({ user_id: decoded.userId });

    await client.close();

    return NextResponse.json(
      { 
        tradeActivities,
        totalCount,
        limit,
        skip
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get trade activity error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
