import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    message: 'Test endpoint is working',
    time: new Date().toISOString()
  })
} 