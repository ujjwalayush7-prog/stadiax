import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

// The GenAI SDK is imported, but we instantiate it inside the POST handler
// to prevent Next.js edge runtime build errors.

export const dynamic = 'force-dynamic';

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    }
  );
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GEMINI_API;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API Key is missing from environment variables' },
        { status: 500 }
      );
    }

    const { message, persona } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Valid message string is required' }, { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey });

    if (message.length > 500) {
      return NextResponse.json(
        { error: 'Message exceeds maximum length of 500 characters' },
        { status: 400 }
      );
    }

    // Simulate rate limit check here (allow pass for now)

    // Explicit regex sanitization for DOM XSS prevention
    const sanitizedMessage = message.replace(/[<>]/g, '');

    let systemInstruction = '';

    if (persona === 'fan') {
      systemInstruction = `
        You are StadiaBot, an enthusiastic, helpful, and multilingual AI assistant for fans attending the FIFA World Cup 2026.
        Your goal is to enhance the stadium experience by helping fans with navigation, food options, transport, and accessibility.
        - The current match is USA vs England. The score is 2-1 for USA.
        - Keep answers concise and exciting.
        - Suggest sustainable transport options when asked about leaving.
        - If asked about accessibility, provide clear, supportive guidance.
        - IMPORTANT: Do not use any markdown formatting (like *, **, or #) in your response. Provide pure plain text.
      `;
    } else {
      systemInstruction = `
        You are the StadiaX Operations AI, an intelligent, analytical assistant for stadium staff and organizers during the FIFA World Cup 2026.
        Your goal is to provide operational intelligence, crowd management advice, and real-time decision support.
        - Current Status: Attendance is 68,402 (94% capacity). Active incidents: Gate 4 Congestion. Energy usage is 4.2 MW.
        - Keep answers professional, concise, and focused on safety and efficiency.
        - If asked about crowd control, suggest rerouting fans or deploying additional volunteers.
        - IMPORTANT: Do not use any markdown formatting (like *, **, or #) in your response. Provide pure plain text.
      `;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: sanitizedMessage,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const responseBody = { reply: response.text };
    return NextResponse.json(responseBody, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
  }
}
