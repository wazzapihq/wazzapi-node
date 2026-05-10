# Webhooks

WazzAPI sends webhook events to your endpoint for incoming messages, message status updates, and device status changes.

## Verify and parse

Always verify the signature before parsing the payload:

```ts
import { WebhookHandler } from "wazzapi";

const handler = new WebhookHandler("your-webhook-secret");
const webhook = handler.verifyAndParse(rawBody, request.headers);

console.log(webhook.event_type);
console.log(webhook.data);
```

## Headers

WazzAPI sends these headers with every webhook:

- `X-Wazzapi-Signature` — HMAC-SHA256 signature of the raw body
- `X-Wazzapi-Event` — event type such as `message.received`
- `X-Wazzapi-Event-ID` — unique event ID

## Supported events

### Message events

- `message.received` — incoming message
- `message.sent` — outbound message accepted by WhatsApp
- `message.delivered` — outbound message delivered
- `message.read` — outbound message read by recipient
- `message.failed` — outbound message failed

### Device events

- `device.connected` — WhatsApp device connected
- `device.disconnected` — WhatsApp device disconnected

## Working with message webhooks

```ts
import { WebhookHandler } from "wazzapi";
import type { PublicMessageWebhook } from "wazzapi";

const handler = new WebhookHandler("your-webhook-secret");
const webhook = handler.verifyAndParse(rawBody, request.headers);

if (webhook.event_type.startsWith("message.")) {
  const messageWebhook = webhook as PublicMessageWebhook;
  console.log(messageWebhook.data.phone_number);
  console.log(messageWebhook.data.status);
  console.log(messageWebhook.data.message_type);
}
```

## Working with device webhooks

```ts
import { WebhookHandler } from "wazzapi";
import type { PublicDeviceWebhook } from "wazzapi";

const handler = new WebhookHandler("your-webhook-secret");
const webhook = handler.verifyAndParse(rawBody, request.headers);

if (webhook.event_type.startsWith("device.")) {
  const deviceWebhook = webhook as PublicDeviceWebhook;
  console.log(deviceWebhook.data.status);
  console.log(deviceWebhook.data.reason);
}
```

## Parse only

For debugging or if you handle verification separately:

```ts
const handler = new WebhookHandler("your-webhook-secret");
const webhook = handler.parse(rawBody);
console.log(webhook.event_type);
```

## Low-level signature verification

```ts
import {
  generateWebhookSignature,
  verifyWebhookSignature,
} from "wazzapi";

const expected = generateWebhookSignature(rawBody, "your-webhook-secret");
const isValid = verifyWebhookSignature(
  rawBody,
  request.headers["x-wazzapi-signature"] as string,
  "your-webhook-secret",
);

console.log(expected, isValid);
```
