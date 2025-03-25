export type UserRole = 'individual' | 'student' | 'teacher' | 'school_admin' | 'community_admin' | 'superuser';

export interface IUser {
  id: string;
  clerkId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  organizationId?: string; // For school or community members
  createdAt: Date;
  updatedAt: Date;
}

export interface ISchool {
  id: string;
  name: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  phone: string;
  email: string;
  website?: string;
  accessCodes: {
    teacher: string;
    student: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface ICommunity {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  phone: string;
  email: string;
  website?: string;
  createdAt: Date;
  updatedAt: Date;
} 