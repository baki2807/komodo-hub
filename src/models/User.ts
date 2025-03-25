import mongoose from 'mongoose';
import { IUser, UserRole } from '@/types/user';

const userSchema = new mongoose.Schema<IUser>(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['individual', 'student', 'teacher', 'school_admin', 'community_admin', 'superuser'],
      required: true,
    },
    organizationId: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for frequently queried fields
userSchema.index({ email: 1 });
userSchema.index({ clerkId: 1 });
userSchema.index({ role: 1 });
userSchema.index({ organizationId: 1 });

const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User; 