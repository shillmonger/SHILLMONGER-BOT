import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
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
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI!);
    }

    const db = mongoose.connection.db;
    if (!db) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }

    // Get open master trades
    const masterTrades = await db.collection('master_trades')
      .find({ status: 'OPEN' })
      .toArray();

    // Get open trade activities (user trades)
    const tradeActivities = await db.collection('trade_activity')
      .find({ status: 'OPEN' })
      .toArray();

    // Get user account info for display
    const userIds = [...new Set(tradeActivities.map(t => t.user_id).filter(id => id))];
    const userAccounts = await db.collection('mt5accounts')
      .find({ userId: { $in: userIds } })
      .project({ userId: 1, mt5Login: 1, server: 1 })
      .toArray();

    // Create a map for quick lookup
    const accountMap = new Map(); 
    userAccounts.forEach(acc => {
      accountMap.set(acc.userId.toString(), {
        mt5Login: acc.mt5Login,
        server: acc.server
      });
    });

    // Attach user account info to trade activities
    const enrichedActivities = tradeActivities.map(activity => ({
      ...activity,
      account_info: accountMap.get(activity.user_id?.toString()) || null
    }));

    return NextResponse.json({
      master_trades: masterTrades,
      trade_activities: enrichedActivities
    }, { status: 200 });
  } catch (error) {
    console.error('Get open trades error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
