import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    // Connect to MongoDB
    const client = new MongoClient(process.env.MONGODB_URI!);
    await client.connect();
    const db = client.db();
    const copyJobsCollection = db.collection('copy_jobs');

    // Fetch all copy jobs
    const copyJobs = await copyJobsCollection
      .find({})
      .sort({ started_at: -1 })
      .toArray();

    await client.close();

    return NextResponse.json(
      { copyJobs },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get copy jobs error:', error);
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
    const copyJobsCollection = db.collection('copy_jobs');

    // Delete all copy jobs
    const result = await copyJobsCollection.deleteMany({});

    await client.close();

    return NextResponse.json(
      { message: `Deleted ${result.deletedCount} copy jobs` },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete copy jobs error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
