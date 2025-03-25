import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { db } from '@/lib/db'
import { courses } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(
  request: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    console.log('Fetching course with ID:', params.courseId)

    const course = await db
      .select()
      .from(courses)
      .where(eq(courses.id, params.courseId))
      .limit(1)

    if (!course || course.length === 0) {
      return NextResponse.json({
        message: 'Course not found',
        courseId: params.courseId
      }, { status: 404 })
    }

    // Ensure modules is an array
    const courseModules = Array.isArray(course[0].modules) ? course[0].modules : [];
    
    // Transform response to match frontend expectations
    const formattedCourse = {
      _id: course[0].id,
      title: course[0].title,
      description: course[0].description,
      thumbnail: course[0].imageUrl || '/images/courses/default-course.jpg',
      level: course[0].level,
      modules: courseModules.map(module => ({
        _id: module.id,  // Use the existing id field from our schema
        title: module.title || '',
        content: module.content || '',
        order: typeof module.order === 'number' ? module.order : 0
      }))
    }

    return NextResponse.json(formattedCourse)
  } catch (error) {
    console.error('Error fetching course:', error)
    return NextResponse.json({
      message: 'Internal Server Error',
      error: error instanceof Error ? error.message : String(error),
      courseId: params.courseId,
      details: JSON.stringify(error)
    }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { courseId: string } }
) {
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

    const [updatedCourse] = await db
      .update(courses)
      .set({
        title,
        description,
        imageUrl,
        level,
        modules
      })
      .where(eq(courses.id, params.courseId))
      .returning()

    if (!updatedCourse) {
      return new NextResponse('Course not found', { status: 404 })
    }

    return NextResponse.json(updatedCourse)
  } catch (error) {
    console.error('Error updating course:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const [deletedCourse] = await db
      .delete(courses)
      .where(eq(courses.id, params.courseId))
      .returning()

    if (!deletedCourse) {
      return new NextResponse('Course not found', { status: 404 })
    }

    return NextResponse.json(deletedCourse)
  } catch (error) {
    console.error('Error deleting course:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 