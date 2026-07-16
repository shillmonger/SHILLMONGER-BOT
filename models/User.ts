import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  isVerified: boolean;
  verificationToken?: string;
  verificationTokenExpires?: Date;
  resetPasswordToken?: string;
  resetPasswordTokenExpires?: Date;
  accountBalance: number;
  totalWithdrawal: number;
  botCommissions: number;
  todaysProfit: number;
  totalProfits: number;
  mt5AccountStatus: 'real' | 'demo';
  referralId: string;
  totalReferrals: number;
  profileImage: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
    },
    verificationTokenExpires: {
      type: Date,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordTokenExpires: {
      type: Date,
    },
    accountBalance: {
      type: Number,
      default: 0,
    },
    totalWithdrawal: {
      type: Number,
      default: 0,
    },
    botCommissions: {
      type: Number,
      default: 0,
    },
    todaysProfit: {
      type: Number,
      default: 0,
    },
    totalProfits: {
      type: Number,
      default: 0,
    },
    mt5AccountStatus: {
      type: String,
      enum: ['real', 'demo'],
      default: 'demo',
    },
    referralId: {
      type: String,
      unique: true,
      required: true,
    },
    totalReferrals: {
      type: Number,
      default: 0,
    },
    profileImage: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
