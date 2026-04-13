import type { Session as AppSession } from 'hey-api-test-schemas';
import 'hono-session/global';

declare module 'hono-session' {
  export interface Session extends AppSession {}
}
