import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { connectToDatabase } from '@/lib/mongodb';
import School from '@/models/School';
import User from '@/models/User';
import { nanoid } from 'nanoid';

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      address,
      city,
      province,
      postalCode,
      phone,
      email,
      website,
    } = body;

    // Validate required fields
    if (!name || !address || !city || !province || !postalCode || !phone || !email) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // Connect to MongoDB
    const db = await connectToDatabase();

    // Check if school already exists
    const existingSchool = await db.collection('schools').findOne({ email });
    if (existingSchool) {
      return new NextResponse('School with this email already exists', { status: 400 });
    }

    // Generate access codes for teachers and students
    const teacherAccessCode = nanoid(8);
    const studentAccessCode = nanoid(8);

    // Create school
    const school = await db.collection('schools').insertOne({
      name,
      address,
      city,
      province,
      postalCode,
      phone,
      email,
      website,
      accessCodes: {
        teacher: teacherAccessCode,
        student: studentAccessCode,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Create school admin user
    const user = await db.collection('users').findOne({ clerkId: userId });
    if (user) {
      await db.collection('users').updateOne(
        { clerkId: userId },
        { 
          $set: {
            organizationId: school.insertedId,
            role: 'school_admin',
            updatedAt: new Date()
          }
        }
      );
    }

    return NextResponse.json({
      school: {
        id: school.insertedId,
        ...body,
        accessCodes: {
          teacher: teacherAccessCode,
          student: studentAccessCode,
        }
      }
    });
  } catch (error) {
    console.error('School registration error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 