import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import MT5Account from '@/models/MT5Account';

export async function GET(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
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

    // Find user's connected MT5 account
    const mt5Account = await MT5Account.findOne({ 
      userId: decoded.userId,
      status: 'connected'
    });

    if (!mt5Account) {
      return NextResponse.json(
        { account: null },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { 
        account: {
          id: mt5Account._id,
          telegramUsername: mt5Account.telegramUsername,
          server: mt5Account.server,
          mt5Login: mt5Account.mt5Login,
          accountType: mt5Account.accountType,
          status: mt5Account.status,
          startDate: mt5Account.startDate,
          expirationDate: mt5Account.expirationDate,
          subscriptionPlan: mt5Account.subscriptionPlan,
          subscriptionExpiryDate: mt5Account.subscriptionExpiryDate,
          balance: mt5Account.balance,
          equity: mt5Account.equity,
          currency: mt5Account.currency
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Get MT5 account error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
