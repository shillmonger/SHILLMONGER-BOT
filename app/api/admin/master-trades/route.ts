import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    // Connect to MongoDB
    const client = new MongoClient(process.env.MONGODB_URI!);
    await client.connect();
    const db = client.db();
    const masterTradesCollection = db.collection('master_trades');

    // Fetch all master trades
    const masterTrades = await masterTradesCollection
      .find({})
      .sort({ created_at: -1 })
      .toArray();

    await client.close();

    return NextResponse.json(
      { masterTrades },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get master trades error:', error);
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
    const masterTradesCollection = db.collection('master_trades');

    // Delete all master trades
    const result = await masterTradesCollection.deleteMany({});

    await client.close();

    return NextResponse.json(
      { message: `Deleted ${result.deletedCount} master trades` },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete master trades error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
