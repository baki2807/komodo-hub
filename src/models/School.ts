import mongoose from 'mongoose';
import { ISchool } from '@/types/user';

const schoolSchema = new mongoose.Schema<ISchool>(
  {
    name: {
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
    accessCodes: {
      teacher: {
        type: String,
        required: true,
      },
      student: {
        type: String,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for frequently queried fields
schoolSchema.index({ name: 1 });
schoolSchema.index({ city: 1 });
schoolSchema.index({ province: 1 });
schoolSchema.index({ email: 1 });

const School = mongoose.models.School || mongoose.model<ISchool>('School', schoolSchema);

export default School; 