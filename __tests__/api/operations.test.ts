import { formatOperationsSnapshot, operationsSnapshot } from '../../src/lib/operations';

describe('operations intelligence snapshot', () => {
  it('formats operational context for AI prompts', () => {
    const promptContext = formatOperationsSnapshot(operationsSnapshot);

    expect(promptContext).toContain('Gate 4 Congestion');
    expect(promptContext).toContain('Accessibility');
    expect(promptContext).toContain('Sustainability');
    expect(promptContext).toContain('Last update');
  });

  it('keeps high-priority incident recommendations in structured data', () => {
    const highPriorityIncident = operationsSnapshot.incidents.find(
      (incident) => incident.severity === 'high'
    );

    expect(operationsSnapshot.capacity.percentage).toBe(94);
    expect(highPriorityIncident?.recommendation).toMatch(/Gates 2 and 6/i);
    expect(operationsSnapshot.accessibility.openRoutes).toContain('East Concourse E2');
  });
});
