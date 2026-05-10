# WazzAPI Node SDK

Official Node.js and TypeScript SDK for WazzAPI.

This package is a modern Node.js and TypeScript SDK for WazzAPI, built with Bun-powered development, typed models, ESM/CJS output, and an API surface that feels natural in TypeScript.

Use it to send WhatsApp messages, manage contacts and groups, work with templates, verify webhooks, and download encrypted WhatsApp media.

## Highlights

- typed `WazzapiClient` with resource-based API access
- Node.js 20, 22, and 24 support
- ESM and CommonJS package output
- bundled declaration files for TypeScript consumers
- camelCase APIs for idiomatic TS usage
- snake_case aliases for compatibility with existing naming styles
- built-in webhook verification helpers
- encrypted media download and decryption helpers
- standard and advanced runnable examples

## Supported Node.js versions

This library supports the following Node.js implementations:

- Node.js 20
- Node.js 22
- Node.js 24 (LTS)

TypeScript consumers are supported as long as their compiler can consume the emitted declaration files.

## Warning

Do not use this Node.js library in a front-end application. Doing so can expose your WazzAPI credentials to end-users as part of the bundled HTML and JavaScript sent to their browser.

## Installation

### Bun

```bash
bun add wazzapi
```

### npm

```bash
npm install wazzapi
```

## Configuration

The SDK uses `https://api.wazzapi.com` by default.

For most integrations, you only need:

- `WAZZAPI_API_KEY`

If you plan to receive webhooks, also configure:

- `WAZZAPI_WEBHOOK_SECRET`

Advanced media examples also use:

- `WAZZAPI_MEDIA_URL`
- `WAZZAPI_MEDIA_KEY`
- `WAZZAPI_MEDIA_MIMETYPE`
- `WAZZAPI_MEDIA_FILE_NAME`
- `WAZZAPI_MEDIA_SHA256`
- `WAZZAPI_MEDIA_ENC_SHA256`

## Quick start

```ts
import { WazzapiClient } from "wazzapi";

const client = new WazzapiClient({
  apiKey: process.env.WAZZAPI_API_KEY,
});

const response = await client.messages.send({
  phone_number: "+6281234567890",
  whatsapp_account_id: "your-whatsapp-account-id",
  content: "Hello from WazzAPI!",
});

console.log(response.message_id, response.status);
```

## API shape

The main client exposes four primary resources:

- `client.contacts`
- `client.groups`
- `client.messages`
- `client.templates`

Preferred TypeScript method names use camelCase:

- `client.contacts.listGroups()`
- `client.groups.getParticipants()`
- `client.messages.sendImage()`
- `client.templates.builtinVariables()`

Snake_case aliases are also available:

- `client.contacts.list_groups()`
- `client.groups.get_participants()`
- `client.messages.send_image()`
- `client.templates.builtin_variables()`

## Error handling

When the API returns a non-success response, the SDK throws `WazzapiAPIError`.

```ts
import { WazzapiAPIError, WazzapiClient } from "wazzapi";

try {
  const client = new WazzapiClient({ apiKey: process.env.WAZZAPI_API_KEY });
  await client.messages.get("missing-message-id");
} catch (error) {
  if (error instanceof WazzapiAPIError) {
    console.error(error.statusCode);
    console.error(error.message);
    console.error(error.details);
  }
}
```

## Webhook verification

Use `WebhookHandler` to verify the raw request body against `X-Wazzapi-Signature` before parsing JSON.

```ts
import { WebhookHandler } from "wazzapi";

const handler = new WebhookHandler(process.env.WAZZAPI_WEBHOOK_SECRET || "");
const event = handler.verifyAndParse(rawBody, request.headers);

console.log(event.event_type);
console.log(event.data);
```

WazzAPI webhook headers:

- `X-Wazzapi-Signature`
- `X-Wazzapi-Event`
- `X-Wazzapi-Event-ID`

Supported webhook event families:

- message events: `message.received`, `message.sent`, `message.delivered`, `message.read`, `message.failed`
- device events: `device.connected`, `device.disconnected`

## Media downloads

Use `downloadMedia()` to retrieve and decrypt WhatsApp media payloads.

```ts
import { downloadMedia } from "wazzapi";

const file = await downloadMedia(mediaUrl, mediaKey, mimeType, {
  file_name: "invoice.pdf",
  file_sha256: expectedPlainSha256,
  file_enc_sha256: expectedEncryptedSha256,
});

console.log(file.file_name, file.file_size);
```

## Examples

### Standard examples

- `examples/list-contacts.ts`
- `examples/send-message.ts`
- `examples/create-template.ts`
- `examples/preview-template.ts`
- `examples/verify-webhook.ts`

### Advanced examples

- `advanced-examples/custom-fetch.ts` — custom fetch injection for logging and telemetry
- `advanced-examples/download-media.ts` — encrypted media download and verification
- `advanced-examples/http-webhook-server.ts` — minimal Node HTTP webhook receiver

## Documentation

Topic-based documentation is available in `docs/`:

- `docs/README.md`
- `docs/authentication.md`
- `docs/client.md`
- `docs/messages.md`
- `docs/groups.md`
- `docs/contacts.md`
- `docs/templates.md`
- `docs/webhooks.md`
- `docs/media.md`
- `docs/errors.md`

Repository: <https://github.com/wazzapihq/wazzapi-node>

## Try it

```bash
bun run examples/list-contacts.ts
bun run examples/send-message.ts
bun run examples/create-template.ts
bun run examples/preview-template.ts
bun run examples/verify-webhook.ts
bun run advanced-examples/custom-fetch.ts
bun run advanced-examples/download-media.ts
bun run advanced-examples/http-webhook-server.ts
```

## Development

```bash
bun install
bun run typecheck
bun test
bun run build
```

## Package output

The build produces:

- `dist/index.js` — ESM bundle
- `dist/index.cjs` — CommonJS bundle
- `dist/index.d.ts` — TypeScript declarations
