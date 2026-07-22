import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import LotSizeManagement from '@/models/LotSizeManagement';
import User from '@/models/User';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params to resolve the Promise
    const { id } = await params;

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

    // Check if user is admin
    const user = await User.findById(decoded.userId);
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    // Delete the lot size rule
    const deletedRule = await LotSizeManagement.findByIdAndDelete(id);

    if (!deletedRule) {
      return NextResponse.json(
        { error: 'Lot size rule not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Lot size rule deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete lot size rule error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
