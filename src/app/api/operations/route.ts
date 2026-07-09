import { NextResponse } from 'next/server';
import { operationsSnapshot } from '../../../lib/operations';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(operationsSnapshot, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}
