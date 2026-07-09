import '@testing-library/jest-dom';

if (typeof global.fetch === 'undefined') {
  global.fetch = jest.fn();
}

if (typeof global.Request === 'undefined') {
  class MockRequest {
    url: string;
    method: string;
    headers: Headers;
    body: unknown;

    constructor(input: string | { url: string }, init?: RequestInit) {
      this.url = typeof input === 'string' ? input : input.url;
      this.method = init?.method || 'GET';
      this.headers = new Headers(init?.headers);
      this.body = init?.body;
    }

    async json() {
      if (typeof this.body === 'string') return JSON.parse(this.body);
      return this.body;
    }
  }

  global.Request = MockRequest as unknown as typeof Request;
}

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
