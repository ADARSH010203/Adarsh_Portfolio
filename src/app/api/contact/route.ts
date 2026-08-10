import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const contactMessage = await db.contactMessage.create({
      data: {
        name: String(name).slice(0, 100),
        email: String(email).slice(0, 200),
        subject: subject ? String(subject).slice(0, 200) : null,
        message: String(message).slice(0, 5000),
      },
    });

    return NextResponse.json({
      success: true,
      id: contactMessage.id,
      message: 'Message received! Adarsh will get back to you soon.',
    });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { error: 'Failed to save message' },
      { status: 500 }
    );
  }
}
