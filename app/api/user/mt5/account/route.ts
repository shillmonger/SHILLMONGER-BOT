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

    // Find all user's MT5 accounts
    const mt5Accounts = await MT5Account.find({ 
      userId: decoded.userId
    }).sort({ createdAt: -1 });

    if (!mt5Accounts || mt5Accounts.length === 0) {
      return NextResponse.json(
        { accounts: [] },
        { status: 200 }
      );
    }

    const formattedAccounts = mt5Accounts.map(account => ({
      id: account._id,
      telegramUsername: account.telegramUsername,
      server: account.server,
      mt5Login: account.mt5Login,
      accountType: account.accountType,
      status: account.status,
      startDate: account.startDate,
      expirationDate: account.expirationDate,
      subscriptionPlan: account.subscriptionPlan,
      subscriptionExpiryDate: account.subscriptionExpiryDate,
      balance: account.balance,
      equity: account.equity,
      currency: account.currency,
      connectedAt: account.connectedAt
    }));

    return NextResponse.json(
      { accounts: formattedAccounts },
      { status: 200 }
    );

  } catch (error) {
    console.error('Get MT5 accounts error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
