import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
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
    const subscriptionsCollection = db.collection('subscriptions');

    // Fetch all subscriptions for the user (try both ObjectId and string)
    console.log('Fetching subscriptions for userId:', decoded.userId);
    let subscriptions = await subscriptionsCollection
      .find({ userId: new ObjectId(decoded.userId) })
      .toArray();
    
    // If no results, try with string userId
    if (subscriptions.length === 0) {
      console.log('No results with ObjectId, trying string userId');
      subscriptions = await subscriptionsCollection
        .find({ userId: decoded.userId })
        .toArray();
    }
    
    console.log('Found subscriptions:', subscriptions.length);
    console.log('Subscription data sample:', subscriptions.slice(0, 2));

    await client.close();

    // Calculate stats
    const approvedSubscriptions = subscriptions.filter(sub => sub.status === 'approved');
    const pendingSubscriptions = subscriptions.filter(sub => sub.status === 'pending');
    const rejectedSubscriptions = subscriptions.filter(sub => sub.status === 'rejected');
    
    // Calculate total amount spent on approved subscriptions
    const totalAmountSpent = approvedSubscriptions.reduce((sum, sub) => sum + (sub.amount || 0), 0);

    // Check for active subscriptions (approved and not expired)
    const now = new Date();
    const activeSubscriptions = approvedSubscriptions.filter(sub => {
      const expirationDate = new Date(sub.expirationDate);
      return expirationDate > now;
    });

    return NextResponse.json(
      { 
        totalAmountSpent,
        pendingCount: pendingSubscriptions.length,
        activeCount: activeSubscriptions.length,
        rejectedCount: rejectedSubscriptions.length,
        subscriptions
      },
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
