import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISubscription extends Document {
  userId: mongoose.Types.ObjectId;
  planType: string;
  amount: number;
  accountSize: string;
  duration: string;
  lotSize: string;
  maxTrades: number;
  targetLabel: string;
  tradingVolume: string;
  screenshotUrl: string;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  startDate?: Date;
  expirationDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    planType: {
      type: String,
      required: true,
      enum: ['Basic Plan', 'Standard Plan', 'Pro Plan'],
    },
    amount: {
      type: Number,
      required: true,
    },
    accountSize: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    lotSize: {
      type: String,
      required: true,
    },
    maxTrades: {
      type: Number,
      required: true,
    },
    targetLabel: {
      type: String,
      required: true,
    },
    tradingVolume: {
      type: String,
      required: true,
    },
    screenshotUrl: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'expired'],
      default: 'pending',
    },
    startDate: {
      type: Date,
    },
    expirationDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Subscription: Model<ISubscription> = mongoose.models.Subscription || mongoose.model<ISubscription>('Subscription', SubscriptionSchema);

export default Subscription;
