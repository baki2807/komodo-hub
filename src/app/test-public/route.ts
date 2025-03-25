import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    message: 'Public test endpoint is working',
    time: new Date().toISOString()
  })
} 