import type { OperationsSnapshot } from '../types';

export const operationsSnapshot: OperationsSnapshot = {
  match: {
    fixture: 'USA vs England',
    venue: 'MetLife Stadium',
    minute: 78,
    score: 'USA 2 - 1 England',
    weather: '24C, partly cloudy, no rain expected',
    updatedAt: '2026-07-19T22:18:00Z',
  },
  capacity: {
    current: 68402,
    maximum: 72000,
    percentage: 94,
    trend: '+2% in last 15 minutes',
  },
  incidents: [
    {
      id: 'INC-G4-042',
      title: 'Gate 4 Congestion',
      severity: 'high',
      zone: 'Zone 3',
      status: 'active',
      recommendation:
        'Open overflow lanes at Gates 2 and 6, push fans through the west concourse, and move 18 volunteers to Zone 3.',
    },
    {
      id: 'INC-S12-018',
      title: 'Section 12 Spill',
      severity: 'low',
      zone: 'Lower Bowl',
      status: 'monitoring',
      recommendation:
        'Send sanitation team Alpha after the current possession ends to avoid aisle disruption.',
    },
    {
      id: 'INC-MED-027',
      title: 'Medical Tent Request',
      severity: 'medium',
      zone: 'East Concourse',
      status: 'active',
      recommendation:
        'Guide guest to the east medical tent and keep accessible corridor E2 clear.',
    },
  ],
  staff: {
    deployed: 412,
    zones: 6,
    gap: 'Zone 3 is short by 18 volunteers for the next 12 minutes.',
  },
  transport: {
    parkingCapacity: 88,
    metroStatus: 'On schedule with 6-minute headways',
    rideshareStatus: 'Lot C pickup queue is 11 minutes',
    recommendation:
      'Promote Metro North exits and hold rideshare pushes until the 88th minute.',
  },
  sustainability: {
    wasteDiversion: 73,
    target: 80,
    energyMw: 4.2,
    recommendation:
      'Redirect vendors to reusable cup returns in Sections 108 and 232 to recover the 7-point waste gap.',
  },
  accessibility: {
    openRoutes: ['Gate 2 elevator bank', 'East Concourse E2', 'Section 214 accessible aisle'],
    alerts: ['Gate 4 accessible ramp is slow because of congestion'],
    recommendation:
      'Route wheelchair users through Gate 2 and keep East Concourse E2 staffed.',
  },
};

export function formatOperationsSnapshot(snapshot: OperationsSnapshot): string {
  const incidentSummary = snapshot.incidents
    .map(
      (incident) =>
        `${incident.title} [${incident.severity.toUpperCase()}] in ${incident.zone}: ${incident.recommendation}`
    )
    .join('\n- ');

  return `
Match: ${snapshot.match.fixture} at ${snapshot.match.venue}, minute ${snapshot.match.minute}, score ${snapshot.match.score}, weather ${snapshot.match.weather}.
Capacity: ${snapshot.capacity.current}/${snapshot.capacity.maximum} (${snapshot.capacity.percentage}%), trend ${snapshot.capacity.trend}.
Incidents:
- ${incidentSummary}
Staff: ${snapshot.staff.deployed} deployed across ${snapshot.staff.zones} zones. Gap: ${snapshot.staff.gap}
Transport: parking ${snapshot.transport.parkingCapacity}% full, metro ${snapshot.transport.metroStatus}, rideshare ${snapshot.transport.rideshareStatus}. Recommendation: ${snapshot.transport.recommendation}
Sustainability: ${snapshot.sustainability.wasteDiversion}% waste diversion vs ${snapshot.sustainability.target}% target, energy ${snapshot.sustainability.energyMw} MW. Recommendation: ${snapshot.sustainability.recommendation}
Accessibility: open routes ${snapshot.accessibility.openRoutes.join(', ')}. Alerts: ${snapshot.accessibility.alerts.join(', ')}. Recommendation: ${snapshot.accessibility.recommendation}
Last update: ${snapshot.match.updatedAt}
  `.trim();
}
