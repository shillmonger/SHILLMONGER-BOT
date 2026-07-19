import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMT5Account extends Document {
  userId: mongoose.Types.ObjectId;
  telegramUsername: string;
  server: string;
  mt5Login: string;
  password: string; // Will be encrypted
  accountType: 'demo' | 'real';
  status: 'connected' | 'disconnected' | 'expired';
  
  // Demo account fields
  startDate?: Date;
  expirationDate?: Date;
  
  // Real account subscription fields
  subscriptionPlan?: string | null; // e.g., "Basic Plan", "Pro Plan"
  subscriptionStartDate?: Date | null;
  subscriptionExpiryDate?: Date | null;
  
  // Account info from MT5
  balance?: number;
  equity?: number;
  currency?: string;
  
  connectedAt: Date;
  lastCheck?: Date;
}

const MT5AccountSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  telegramUsername: {
    type: String,
    required: true
  },
  server: {
    type: String,
    required: true
  },
  mt5Login: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  accountType: {
    type: String,
    enum: ['demo', 'real'],
    required: true
  },
  status: {
    type: String,
    enum: ['connected', 'disconnected', 'expired'],
    default: 'connected'
  },
  
  // Demo account specific fields
  startDate: {
    type: Date,
    required: function(this: IMT5Account) {
      return this.accountType === 'demo';
    }
  },
  expirationDate: {
    type: Date,
    required: function(this: IMT5Account) {
      return this.accountType === 'demo';
    }
  },
  
  // Real account subscription fields
  subscriptionPlan: {
    type: String,
    default: null
  },
  subscriptionStartDate: {
    type: Date,
    default: null
  },
  subscriptionExpiryDate: {
    type: Date,
    default: null
  },
  
  // Account info from MT5
  balance: {
    type: Number,
    default: 0
  },
  equity: {
    type: Number,
    default: 0
  },
  currency: {
    type: String,
    default: 'USD'
  },
  
  connectedAt: {
    type: Date,
    default: Date.now
  },
  lastCheck: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for efficient queries
MT5AccountSchema.index({ userId: 1, status: 1 });
MT5AccountSchema.index({ mt5Login: 1 });

const MT5Account: Model<IMT5Account> = mongoose.models.MT5Account || mongoose.model<IMT5Account>('MT5Account', MT5AccountSchema);

export default MT5Account;
