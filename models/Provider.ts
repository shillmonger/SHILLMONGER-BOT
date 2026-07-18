import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProvider extends Document {
  groupId: string;
  groupName: string;
  profileImage?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProviderSchema: Schema = new Schema(
  {
    groupId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    groupName: {
      type: String,
      required: true,
      trim: true,
    },
    profileImage: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Provider: Model<IProvider> = mongoose.models.Provider || mongoose.model<IProvider>('Provider', ProviderSchema);

export default Provider;
