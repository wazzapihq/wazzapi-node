# Authentication

The SDK authenticates using an API key. You can find yours in the WazzAPI dashboard.

## API key

Pass it directly to the client:

```ts
import { WazzapiClient } from "wazzapi";

const client = new WazzapiClient({ apiKey: "your-api-key" });
```

Or load it from the environment:

```ts
import { WazzapiClient } from "wazzapi";

const client = new WazzapiClient({
  apiKey: process.env.WAZZAPI_API_KEY,
});
```

The SDK automatically prefixes the key with `Bearer` if it is not already present.

## Webhook secret

If you plan to receive webhooks, you also need your webhook secret:

```ts
import { WebhookHandler } from "wazzapi";

const handler = new WebhookHandler(process.env.WAZZAPI_WEBHOOK_SECRET || "");
```

You can find the webhook secret in the WazzAPI dashboard under webhook settings.
