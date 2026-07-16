import '@testing-library/react-native/extend-expect';
import { server } from './msw-server';

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
