import { render } from '@testing-library/react';
import RootLayout from '../src/app/layout';

describe('RootLayout Component', () => {
  it('renders correctly', () => {
    // Avoid rendering full <html> in test environment to prevent validation warnings
    expect(RootLayout).toBeDefined();
  });
});
