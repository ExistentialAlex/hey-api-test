import type { MessageSchema } from 'hey-api-test-i18n';

declare module '@intlify/hono' {
  // extend `DefineLocaleMessage` with `ResourceSchema`
  export interface DefineLocaleMessage extends MessageSchema {}
}
