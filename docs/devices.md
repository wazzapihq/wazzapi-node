# Devices

Inspect WhatsApp devices available to your organization.

## List devices

```ts
import { WazzapiClient } from "@wazzapi/wazzapi";

const client = new WazzapiClient({ apiKey: process.env.WAZZAPI_API_KEY });
const response = await client.devices.list({
  limit: 50,
  status: "connected",
  sort_by: "created_at",
  sort_order: "desc",
});

for (const device of response.devices) {
  console.log(device.id, device.name, device.status, device.phone_number);
}
```

Supported filters from the public API reference include:

- `limit`
- `offset`
- `status`
- `search`
- `sort_by`
- `sort_order`

## Get a device

```ts
const device = await client.devices.get("device-id");

console.log(device.name, device.session_name, device.timezone);
console.log(device.daily_message_limit, device.message_delay_ms);
```
