export class HttpResponse extends Response {
  static json(data: any, init?: ResponseInit): Response {
    const bodyStr = JSON.stringify(data);
    const headers = new Headers(init?.headers);
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
    return new Response(bodyStr, {
      status: init?.status ?? 200,
      statusText: init?.statusText ?? 'OK',
      headers,
    });
  }

  static error(): Response {
    const res = new Response(null, { status: 0 });
    Object.defineProperty(res, '__isNetworkError', { value: true });
    return res;
  }
}

export interface RequestHandler {
  method: string;
  pattern: string;
  resolver: (info: { request: any; params: any }) => any;
}

function matchPath(pattern: string, url: string): boolean {
  let effectivePattern = pattern;
  if (!effectivePattern.startsWith('http') && !effectivePattern.startsWith('*')) {
    effectivePattern = '*' + (effectivePattern.startsWith('/') ? '' : '/') + effectivePattern;
  }
  const regexStr = effectivePattern
    .split('*')
    .map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('.*');
  const regex = new RegExp('^' + regexStr + '$');
  return regex.test(url);
}

function createHandler(method: string) {
  return (pattern: string, resolver: (info: { request: any; params: any }) => any): RequestHandler => ({
    method: method.toUpperCase(),
    pattern,
    resolver,
  });
}

export const http = {
  get: createHandler('GET'),
  post: createHandler('POST'),
  put: createHandler('PUT'),
  patch: createHandler('PATCH'),
  delete: createHandler('DELETE'),
};

let activeHandlers: RequestHandler[] = [];
let initialHandlers: RequestHandler[] = [];
let originalFetch: typeof global.fetch | null = null;

export class MockServer {
  constructor(...handlers: RequestHandler[]) {
    initialHandlers = [...handlers];
    activeHandlers = [...handlers];
  }

  use(...handlers: RequestHandler[]) {
    activeHandlers.unshift(...handlers);
  }

  resetHandlers(...newHandlers: RequestHandler[]) {
    if (newHandlers.length > 0) {
      activeHandlers = [...newHandlers];
    } else {
      activeHandlers = [...initialHandlers];
    }
  }

  listen(options?: any) {
    if (!originalFetch) {
      originalFetch = global.fetch;
    }
    global.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : (input as Request).url;
      const method = (init?.method || (typeof input === 'object' && 'method' in input ? (input as Request).method : 'GET')).toUpperCase();

      const matchedHandler = activeHandlers.find(
        (h) => h.method === method && matchPath(h.pattern, url)
      );

      if (matchedHandler) {
        const request = {
          url,
          method,
          headers: init?.headers,
          json: async () => {
            if (typeof init?.body === 'string') {
              try { return JSON.parse(init.body); } catch { return {}; }
            }
            return init?.body ?? {};
          },
          text: async () => {
            if (typeof init?.body === 'string') return init.body;
            return String(init?.body ?? '');
          },
        };
        const response = await matchedHandler.resolver({ request, params: {} });
        if (response && (response as any).__isNetworkError) {
          throw new TypeError('Network request failed');
        }
        return response;
      }

      return new Response(JSON.stringify({ message: 'Not Found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }) as any;
  }

  close() {
    if (originalFetch) {
      global.fetch = originalFetch;
      originalFetch = null;
    }
  }
}

export function setupServer(...handlers: RequestHandler[]) {
  return new MockServer(...handlers);
}
