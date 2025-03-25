import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { courses } from '@/lib/db/schema'

export async function GET() {
  try {
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

    return NextResponse.json({
      message: 'Courses fetched successfully',
      count: formattedCourses.length,
      courses: formattedCourses
    })
  } catch (error) {
    console.error('Error fetching courses:', error)
    return NextResponse.json({
      message: 'Internal Server Error',
      error: error instanceof Error ? error.message : String(error),
      details: JSON.stringify(error)
    }, { status: 500 })
  }
} 