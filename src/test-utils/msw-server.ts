import { setupServer } from 'msw/node';

/**
 * Global MSW server for API mocking in tests.
 * Add feature-specific handlers by importing them in test files:
 *
 *   import { productHandlers } from '@features/products/api/mock-handlers';
 *   server.use(...productHandlers);
 */
export const server = setupServer();
