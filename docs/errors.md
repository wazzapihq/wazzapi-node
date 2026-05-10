# Errors

The SDK throws typed error classes for API, media, and webhook failures.

## `WazzapiAPIError`

Raised when the API returns a non-2xx response:

```ts
import { WazzapiAPIError, WazzapiClient } from "@wazzapi/wazzapi";

try {
  const client = new WazzapiClient({ apiKey: process.env.WAZZAPI_API_KEY });
  await client.messages.get("missing-message-id");
} catch (error) {
  if (error instanceof WazzapiAPIError) {
    console.log(error.statusCode);
    console.log(error.message);
    console.log(error.details);
  }
}
```

## `WazzapiMediaError`

Raised when media download or decryption fails:

```ts
import { WazzapiMediaError, downloadMedia } from "@wazzapi/wazzapi";

try {
  await downloadMedia("https://example.com/missing.jpg", "media-key", "image/jpeg");
} catch (error) {
  if (error instanceof WazzapiMediaError) {
    console.log(error.message);
  }
}
```

## Webhook errors

The webhook helpers raise these classes:

- `WazzapiWebhookError`
- `WazzapiWebhookVerificationError`
- `WazzapiWebhookParseError`

## Error hierarchy

```text
WazzapiError
├── WazzapiAPIError
├── WazzapiMediaError
└── WazzapiWebhookError
    ├── WazzapiWebhookVerificationError
    └── WazzapiWebhookParseError
```
