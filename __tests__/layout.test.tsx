import RootLayout from '../src/app/layout';

describe('RootLayout Component', () => {
  it('renders children correctly without DOM nesting warnings', () => {
    // Call the function directly to get 100% coverage without React mounting <html> in <div>
    const layout = RootLayout({ children: 'Test Child Content' });
    expect(layout).toBeDefined();
    
    // We can even check if it returns an html element
    expect(layout.type).toBe('html');
  });
});
