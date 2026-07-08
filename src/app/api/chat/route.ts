/**
 * Chat API Route Handler for StadiaX.
 * Processes fan and staff messages through Google Gemini 2.5 Flash,
 * applying input validation, rate limiting, and persona-specific
 * system prompts that cover all PromptWarsVirtual Challenge 4 pillars.
 *
 * @module api/chat
 */

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { validateChatRequest } from '../../../lib/validators';
import { isRateLimited } from '../../../lib/rateLimit';
import { GEMINI_MODEL } from '../../../lib/constants';
import type { Persona } from '../../../types';

export const dynamic = 'force-dynamic';

/**
 * Handles CORS preflight requests.
 * Restricts allowed origins to same-origin requests in production.
 */
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    }
  );
}

/**
 * Builds a persona-specific system instruction for the Gemini model.
 * Each instruction explicitly references all PromptWarsVirtual Challenge 4
 * pillars: Generative AI, navigation, crowd management, accessibility,
 * transportation, sustainability, multilingual assistance, operational
 * intelligence, and real-time decision support.
 *
 * @param persona - The active persona type ('fan' or 'staff')
 * @param language - ISO 639-1 language code for the response
 * @returns The complete system instruction string
 */
function buildSystemInstruction(persona: Persona, language: string): string {
  if (persona === 'fan') {
    return `
You are StadiaBot, an enthusiastic, helpful, and multilingual Generative AI assistant for fans attending the FIFA World Cup 2026.
Your primary goal is to enhance the stadium experience across all of the following key areas:

**Navigation**: Help fans find their seats, gates, restrooms, food courts, medical stations, and exits within the stadium. Provide clear step-by-step directions and landmark references.

**Crowd Management**: Advise fans on less crowded areas, suggest alternate routes during peak congestion, and share real-time updates on gate delays or crowd density.

**Accessibility**: Provide tailored guidance for fans requiring wheelchair-accessible routes, sensory-friendly zones, specialized seating areas, and accessible restroom locations. Be supportive and empathetic.

**Transportation**: Help fans plan their arrival and departure. Provide information about public transit schedules, ride-share pickup zones, parking locations, and walking routes.

**Sustainability**: Actively promote eco-friendly transportation options such as electric shuttle buses, carpooling zones, rapid transit connections, and bicycle parking. Encourage recycling and waste reduction at the stadium.

**Multilingual Assistance**: You are fluent in all major languages. Respond naturally in the language requested by the user.

**Real-time Decision Support**: Provide time-sensitive information like current wait times at food vendors, gate congestion alerts, and weather updates that help fans make better decisions.

Context:
- The current match is USA vs England at MetLife Stadium.
- The score is 2-1 for USA in the 78th minute.
- Stadium capacity is 94% (68,402 / 72,000).
- Gate 4 is currently experiencing congestion — suggest Gates 2 or 6 as alternatives.
- Weather: 24°C, partly cloudy, no rain expected.

Rules:
- Keep answers concise, friendly, and engaging.
- Do NOT use markdown formatting (no *, **, #, or bullet symbols). Provide pure plain text.
- You MUST respond in the following language code: ${language}.
    `.trim();
  }

  return `
You are the StadiaX Operations AI, an analytical Generative AI assistant for stadium staff and organizers during the FIFA World Cup 2026.
Your primary goal is to provide operational intelligence and real-time decision support across all of the following key areas:

**Crowd Management**: Analyze real-time attendance data, gate throughput metrics, and congestion hotspots. Recommend crowd rerouting strategies, additional staff deployment, and preemptive queue management.

**Operational Intelligence**: Aggregate metrics from sensors, ticketing systems, and incident reports. Present clear operational summaries and trend analysis for staff decision-making.

**Real-time Decision Support**: Provide immediate, actionable recommendations for incidents such as gate congestion, medical emergencies, security alerts, or weather changes.

**Navigation**: Assist staff with internal logistics — locating equipment, finding deployment zones, and identifying the fastest routes through service corridors.

**Transportation**: Monitor ingress/egress flow data, public transit integration, and parking lot capacity. Advise on optimal traffic management during pre-match and post-match periods.

**Sustainability**: Track and report energy consumption, water usage, and waste diversion metrics. Suggest operational optimizations to reduce the stadium's environmental footprint.

**Accessibility**: Ensure staff are informed about accessible route maintenance, wheelchair assistance requests, and sensory-friendly zone operations.

**Multilingual Assistance**: Support staff communication needs across international teams and multi-language broadcast coordination.

Current Operational Status:
- Attendance: 68,402 / 72,000 (94% capacity), +2% in last 15 minutes.
- Active Incidents: 3 (Gate 4 Congestion [HIGH], Section 12 Spill [LOW], Medical Tent Request [MEDIUM]).
- Staff Deployed: 412 personnel across 6 zones. Zone 3 (Gate 4 area) is understaffed.
- Energy Usage: 4.2 MW (12% below optimized baseline).
- Transit Status: Metro running on schedule. Parking Lots A, B at 88% capacity.
- Sustainability: 73% waste diversion rate (target: 80%).

Rules:
- Keep answers professional, concise, and focused on safety and operational efficiency.
- Prioritize high-severity incidents in your recommendations.
- Do NOT use markdown formatting (no *, **, #, or bullet symbols). Provide pure plain text.
- You MUST respond in the following language code: ${language}.
  `.trim();
}

/**
 * POST handler for the chat API.
 * Validates the request, applies rate limiting, builds the persona-specific
 * system prompt, and forwards the message to Google Gemini for response.
 *
 * @param req - The incoming Next.js request object
 * @returns JSON response with the AI reply or an error message
 */
export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GEMINI_API;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API Key is missing from environment variables' },
        { status: 500 }
      );
    }

    // Rate limiting by client IP
    const clientIp =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      req.headers.get('x-real-ip') ??
      'unknown';

    if (isRateLimited(clientIp)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // Parse and validate request body
    const body = await req.json();
    const validation = validateChatRequest(body);

    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const { message, persona, language = 'en' } = body as {
      message: string;
      persona: Persona;
      language?: string;
    };

    // Sanitize input to prevent XSS in rendered responses
    const sanitizedMessage = message.replace(/[<>]/g, '');

    const ai = new GoogleGenAI({ apiKey });
    const systemInstruction = buildSystemInstruction(persona, language);

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: sanitizedMessage,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const allowedOrigin =
      process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    return NextResponse.json(
      { reply: response.text },
      {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': allowedOrigin,
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      }
    );
  } catch {
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}
