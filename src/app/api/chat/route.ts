import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { validateChatRequest } from '../../../lib/validators';
import { isRateLimited } from '../../../lib/rateLimit';
import { GEMINI_MODEL } from '../../../lib/constants';
import { formatOperationsSnapshot, operationsSnapshot } from '../../../lib/operations';
import type { Persona } from '../../../types';

export const dynamic = 'force-dynamic';

const allowedOrigin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const responseHeaders = {
  'Access-Control-Allow-Origin': allowedOrigin,
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-Staff-Access-Token',
};

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: responseHeaders,
    }
  );
}

function buildSystemInstruction(persona: Persona, language: string): string {
  const liveContext = formatOperationsSnapshot(operationsSnapshot);

  if (persona === 'fan') {
    return `
You are StadiaBot, a concise, multilingual Generative AI assistant for fans attending the FIFA World Cup 2026.
Use the live stadium operations snapshot below to improve navigation, crowd management, accessibility, transportation, sustainability, multilingual assistance, and real-time decisions.

Live Stadium Snapshot:
${liveContext}

Fan guidance rules:
- For navigation, give step-by-step directions with landmarks, gates, sections, and accessible alternatives.
- For crowd management, recommend lower-density gates and routes before explaining why.
- For accessibility, prioritize step-free routes, elevator banks, accessible restrooms, and staff handoff points.
- For transportation, prefer public transit, shuttle, walking, and low-emission options when practical.
- For sustainability, include one practical eco-friendly action only when relevant.
- Keep answers concise, friendly, and plain text.
- Do not use markdown formatting.
- Respond in this language code: ${language}.
    `.trim();
  }

  return `
You are StadiaX Operations AI, a decision-support Generative AI assistant for FIFA World Cup 2026 stadium staff.
Use the live stadium operations snapshot below to prioritize safety, crowd flow, accessibility, transport, sustainability, and staffing actions.

Live Stadium Snapshot:
${liveContext}

Operations rules:
- Start with the highest-risk issue and the immediate action.
- Include staff deployment numbers, zones, or route recommendations when available.
- Distinguish active incidents from monitoring items.
- Mention accessibility and sustainability impacts when an action affects them.
- Keep answers professional, concise, and plain text.
- Do not use markdown formatting.
- Respond in this language code: ${language}.
  `.trim();
}

function getClientIdentifier(req: NextRequest): string {
  const forwardedFor = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  const realIp = req.headers.get('x-real-ip')?.trim();
  return forwardedFor || realIp || 'unknown-client';
}

function buildFallbackReply(persona: Persona, message: string): string {
  const highPriorityIncident = operationsSnapshot.incidents.find(
    (incident) => incident.severity === 'high'
  );
  const lowerMessage = message.toLowerCase();

  if (persona === 'staff') {
    return `Highest priority: ${highPriorityIncident?.title}. ${highPriorityIncident?.recommendation} Accessibility impact: ${operationsSnapshot.accessibility.recommendation} Transit status: ${operationsSnapshot.transport.metroStatus}.`;
  }

  if (lowerMessage.includes('transport') || lowerMessage.includes('metro') || lowerMessage.includes('parking')) {
    return `Metro is ${operationsSnapshot.transport.metroStatus}. Parking lots are ${operationsSnapshot.transport.parkingCapacity}% full, so use Metro North exits if possible and avoid rideshare until queues ease.`;
  }

  if (lowerMessage.includes('access') || lowerMessage.includes('wheelchair')) {
    return `${operationsSnapshot.accessibility.recommendation} Open accessible routes include ${operationsSnapshot.accessibility.openRoutes.join(', ')}.`;
  }

  if (lowerMessage.includes('eco') || lowerMessage.includes('sustain')) {
    return `${operationsSnapshot.sustainability.recommendation} Current waste diversion is ${operationsSnapshot.sustainability.wasteDiversion}% against an ${operationsSnapshot.sustainability.target}% target.`;
  }

  return `For the fastest route right now, avoid Gate 4 congestion and use Gates 2 or 6. The match is ${operationsSnapshot.match.score} in minute ${operationsSnapshot.match.minute}, stadium capacity is ${operationsSnapshot.capacity.percentage}%, and accessible support is available through ${operationsSnapshot.accessibility.openRoutes[0]}.`;
}

function logProviderError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  console.error('Gemini provider failed, using operations fallback:', message);
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GEMINI_API;

    if (isRateLimited(getClientIdentifier(req))) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

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

    if (persona === 'staff' && process.env.STAFF_ACCESS_TOKEN) {
      const staffToken = req.headers.get('x-staff-access-token');
      if (staffToken !== process.env.STAFF_ACCESS_TOKEN) {
        return NextResponse.json(
          { error: 'Staff access token is required' },
          { status: 403 }
        );
      }
    }

    const sanitizedMessage = message.replace(/[<>]/g, '');

    if (!apiKey) {
      return NextResponse.json(
        { reply: buildFallbackReply(persona, sanitizedMessage), source: 'operations-fallback' },
        { status: 200, headers: responseHeaders }
      );
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: sanitizedMessage,
        config: {
          systemInstruction: buildSystemInstruction(persona, language),
          temperature: 0.7,
        },
      });

      const reply = response.text?.trim();
      if (!reply) {
        throw new Error('Gemini returned an empty response');
      }

      return NextResponse.json(
        { reply, source: 'gemini' },
        { status: 200, headers: responseHeaders }
      );
    } catch (error) {
      logProviderError(error);
      return NextResponse.json(
        { reply: buildFallbackReply(persona, sanitizedMessage), source: 'operations-fallback' },
        { status: 200, headers: responseHeaders }
      );
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid chat request';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
