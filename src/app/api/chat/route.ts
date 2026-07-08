import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

// Initialize the GenAI SDK
// It automatically picks up the GEMINI_API_KEY from environment variables
const ai = new GoogleGenAI({});

export async function POST(req: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is missing from environment variables' }, { status: 500 });
    }

    const { message, persona } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

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
      contents: message,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    return NextResponse.json({ reply: response.text });
  } catch (error) {
    console.error('Error generating AI response:', error);
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
  }
}
