import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { db } from '@/lib/db'
import { courses } from '@/lib/db/schema'

export async function GET() {
  try {
    // Comment this back in for production
    const { userId } = auth()
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const allCourses = await db
      .select()
      .from(courses)

    console.log('Fetched courses:', allCourses.length)

    // Transform the data to match the expected format in the frontend
    const formattedCourses = allCourses.map(course => {
      const courseModules = Array.isArray(course.modules) ? course.modules : [];
      
      return {
        _id: course.id,
        title: course.title,
        description: course.description,
        thumbnail: course.imageUrl || '/images/courses/default-course.jpg',
        level: course.level,
        modules: courseModules.map(module => ({
          _id: module.id,
          title: module.title || '',
          content: module.content || ''
        }))
      };
    });

    return NextResponse.json(formattedCourses)
  } catch (error) {
    console.error('Error fetching courses:', error)
    return NextResponse.json({
      message: 'Internal Server Error',
      error: error instanceof Error ? error.message : String(error),
      details: JSON.stringify(error)
    }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await request.json()
    const { title, description, imageUrl, level, modules } = body

    if (!title || !description || !level || !modules) {
      return new NextResponse('Missing required fields', { status: 400 })
    }

    const [newCourse] = await db
      .insert(courses)
      .values({
        title,
        description,
        imageUrl,
        level,
        modules
      })
      .returning()

    return NextResponse.json(newCourse)
  } catch (error) {
    console.error('Error creating course:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 