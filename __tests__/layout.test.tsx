import { render } from '@testing-library/react';
import RootLayout from '../src/app/layout';

describe('RootLayout Component', () => {
  it('renders children correctly', () => {
    // We render this to ensure 100% statement coverage for layout.tsx
    const { getByText } = render(
      <RootLayout>
        <div>Test Child Content</div>
      </RootLayout>
    );

    expect(getByText('Test Child Content')).toBeInTheDocument();
  });
});
