import mongoose from 'mongoose';
import { ICommunity } from '@/types/user';

const communitySchema = new mongoose.Schema<ICommunity>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    province: {
      type: String,
      required: true,
    },
    postalCode: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    website: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for frequently queried fields
communitySchema.index({ name: 1 });
communitySchema.index({ city: 1 });
communitySchema.index({ province: 1 });
communitySchema.index({ email: 1 });

const Community = mongoose.models.Community || mongoose.model<ICommunity>('Community', communitySchema);

export default Community; 