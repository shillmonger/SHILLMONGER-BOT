import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    // Connect to MongoDB
    const client = new MongoClient(process.env.MONGODB_URI!);
    await client.connect();
    const db = client.db();
    const tradeActivityCollection = db.collection('trade_activity');

    // Fetch all trade activities
    const tradeActivities = await tradeActivityCollection
      .find({})
      .sort({ created_at: -1 })
      .toArray();

    await client.close();

    return NextResponse.json(
      { tradeActivities },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get trade activities error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Connect to MongoDB
    const client = new MongoClient(process.env.MONGODB_URI!);
    await client.connect();
    const db = client.db();
    const tradeActivityCollection = db.collection('trade_activity');

    // Delete all trade activities
    const result = await tradeActivityCollection.deleteMany({});

    await client.close();

    return NextResponse.json(
      { message: `Deleted ${result.deletedCount} trade activities` },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete trade activities error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
