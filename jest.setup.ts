import '@testing-library/jest-dom';

// Polyfill for fetch in Node.js environment
if (typeof global.fetch === 'undefined') {
  global.fetch = jest.fn();
}

// Polyfill for Request in Node.js environment (required for Next.js route testing)
if (typeof global.Request === 'undefined') {
  global.Request = class Request {
    url: string;
    method: string;
    headers: Headers;
    body: any;
    constructor(input: any, init?: any) {
      this.url = typeof input === 'string' ? input : input.url;
      this.method = init?.method || 'GET';
      this.headers = new Headers(init?.headers);
      this.body = init?.body;
    }
    async json() {
      if (typeof this.body === 'string') return JSON.parse(this.body);
      return this.body;
    }
  } as any;
}

// Mock the Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
  }),
  usePathname: () => '',
  useSearchParams: () => new URLSearchParams(),
}));
