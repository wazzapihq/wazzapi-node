# Client

`WazzapiClient` is the main entry point for all API calls.

## Initialize

```ts
import { WazzapiClient } from "wazzapi";

const client = new WazzapiClient({ apiKey: "your-api-key" });
```

## Close the client

The SDK uses `fetch`, so there is no long-lived HTTP session to tear down, but `close()` is available for API symmetry:

```ts
await client.close();
```

## Custom base URL

For testing or custom deployments:

```ts
const client = new WazzapiClient({
  baseUrl: "https://api.example.com",
  apiKey: "your-api-key",
});
```

## Custom timeout

```ts
const client = new WazzapiClient({
  apiKey: "your-api-key",
  timeout: 60_000,
});
```

## Bring your own fetch

```ts
const client = new WazzapiClient({
  apiKey: "your-api-key",
  fetch: async (input, init) => fetch(input, init),
});
```

## Custom headers

```ts
const client = new WazzapiClient({
  apiKey: "your-api-key",
  headers: {
    "X-SDK-Example": "custom-header",
  },
});
```

## Resources

The client exposes resources as properties:

- `client.contacts` — contact and contact-group management
- `client.groups` — WhatsApp group management
- `client.messages` — send and manage messages
- `client.templates` — template management
