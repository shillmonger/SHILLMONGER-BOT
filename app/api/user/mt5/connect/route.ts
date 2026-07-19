import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import MT5Account from '@/models/MT5Account';

// Helper function to calculate demo account expiration date (7 days excluding weekends)
function calculateDemoExpiration(): Date {
  const startDate = new Date();
  let tradingDays = 0;
  let currentDate = new Date(startDate);

  while (tradingDays < 7) {
    currentDate.setDate(currentDate.getDate() + 1);
    const dayOfWeek = currentDate.getDay();
    
    // Skip Saturday (6) and Sunday (0)
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      tradingDays++;
    }
  }

  return currentDate;
}

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { 
      telegramUsername, 
      server, 
      mt5Login, 
      password, 
      accountType 
    } = body;

    if (!telegramUsername || !server || !mt5Login || !password || !accountType) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Forward to Python bot for validation
    const botApiUrl = process.env.NEXT_PUBLIC_BOT_API_URL || 'http://localhost:8000';
    
    const validationResponse = await fetch(`${botApiUrl}/api/mt5/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        server,
        login: mt5Login,
        password
      })
    });

    const validationResult = await validationResponse.json();

    if (!validationResponse.ok || !validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error || 'Invalid MT5 credentials' },
        { status: 400 }
      );
    }

    // If validation successful, save to database
    await mongoose.connect(process.env.MONGODB_URI!);

    // Check if user already has a connected account of the same type
    const existingConnectedAccount = await MT5Account.findOne({
      userId: decoded.userId,
      accountType: accountType,
      status: 'connected'
    });

    if (existingConnectedAccount) {
      return NextResponse.json(
        { error: `You already have a connected ${accountType} account. You can only have one ${accountType} account at a time.` },
        { status: 409 }
      );
    }

    // Check if account already exists
    const existingAccount = await MT5Account.findOne({ mt5Login });
    
    if (existingAccount) {
      // If account exists and is already connected, return error
      if (existingAccount.status === 'connected') {
        return NextResponse.json(
          { error: 'This MT5 account is already connected' },
          { status: 409 }
        );
      }
      
      // If account is expired, prevent reconnection
      if (existingAccount.status === 'expired') {
        return NextResponse.json(
          { error: 'This account has expired and cannot be reconnected. Please create a new account.' },
          { status: 409 }
        );
      }
      
      // If account exists but is disconnected, update it to connected
      const updateData: any = {
        status: 'connected',
        telegramUsername,
        server,
        password,
        accountType,
        balance: validationResult.accountInfo?.balance || 0,
        equity: validationResult.accountInfo?.equity || 0,
        currency: validationResult.accountInfo?.currency || 'USD',
        connectedAt: new Date()
      };

      // Update demo/real specific fields
      if (accountType === 'demo') {
        updateData.startDate = new Date();
        updateData.expirationDate = calculateDemoExpiration();
      } else {
        updateData.subscriptionPlan = null;
        updateData.subscriptionStartDate = null;
        updateData.subscriptionExpiryDate = null;
      }

      const updatedAccount = await MT5Account.findByIdAndUpdate(
        existingAccount._id,
        updateData,
        { new: true }
      );

      if (!updatedAccount) {
        return NextResponse.json(
          { error: 'Failed to reconnect account' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        account: {
          id: updatedAccount._id,
          telegramUsername: updatedAccount.telegramUsername,
          server: updatedAccount.server,
          mt5Login: updatedAccount.mt5Login,
          accountType: updatedAccount.accountType,
          status: updatedAccount.status,
          startDate: updatedAccount.startDate,
          expirationDate: updatedAccount.expirationDate,
          subscriptionPlan: updatedAccount.subscriptionPlan,
          subscriptionExpiryDate: updatedAccount.subscriptionExpiryDate,
          balance: updatedAccount.balance,
          equity: updatedAccount.equity,
          currency: updatedAccount.currency
        }
      }, { status: 200 });
    }

    // Prepare account data based on type
    const accountData: any = {
      userId: decoded.userId,
      telegramUsername,
      server,
      mt5Login,
      password, // Note: In production, this should be encrypted
      accountType,
      status: 'connected',
      balance: validationResult.accountInfo?.balance || 0,
      equity: validationResult.accountInfo?.equity || 0,
      currency: validationResult.accountInfo?.currency || 'USD',
      connectedAt: new Date()
    };

    if (accountType === 'demo') {
      accountData.startDate = new Date();
      accountData.expirationDate = calculateDemoExpiration();
    } else {
      // Real account - subscription fields are null initially
      accountData.subscriptionPlan = null;
      accountData.subscriptionStartDate = null;
      accountData.subscriptionExpiryDate = null;
    }

    const mt5Account = await MT5Account.create(accountData);

    return NextResponse.json({
      success: true,
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
    }, { status: 201 });

  } catch (error) {
    console.error('MT5 connection error:', error);
    return NextResponse.json(
      { error: 'Failed to connect MT5 account' },
      { status: 500 }
    );
  }
}
