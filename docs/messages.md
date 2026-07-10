# Messages

Send and manage WhatsApp messages.

## Send a text message

```ts
import { WazzapiClient } from "@wazzapi/wazzapi";

const client = new WazzapiClient({ apiKey: process.env.WAZZAPI_API_KEY });
const response = await client.messages.send({
  phone_number: "+6281234567890",
  whatsapp_account_id: "your-whatsapp-account-id",
  content: "Hello from WazzAPI!",
});

console.log(response.message_id);
```

## Send media

```ts
await client.messages.sendImage({
  phone_number: "+6281234567890",
  whatsapp_account_id: "your-whatsapp-account-id",
  media_url: "https://example.com/image.jpg",
  caption: "Check this out",
});

await client.messages.sendVideo({
  phone_number: "+6281234567890",
  whatsapp_account_id: "your-whatsapp-account-id",
  media_url: "https://example.com/video.mp4",
  caption: "Watch this",
});

await client.messages.sendDocument({
  phone_number: "+6281234567890",
  whatsapp_account_id: "your-whatsapp-account-id",
  media_url: "https://example.com/doc.pdf",
});

await client.messages.sendVoice({
  phone_number: "+6281234567890",
  whatsapp_account_id: "your-whatsapp-account-id",
  media_url: "https://example.com/voice.ogg",
});

// Inline base64 media (takes precedence over media_url when both are set)
await client.messages.sendImage({
  phone_number: "+6281234567890",
  whatsapp_account_id: "your-whatsapp-account-id",
  media_base64: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  caption: "Inline image",
});

// Document from raw base64 requires filename or mimetype
await client.messages.sendDocument({
  phone_number: "+6281234567890",
  whatsapp_account_id: "your-whatsapp-account-id",
  media_base64: "JVBERi0xLjQKJcfs...",
  filename: "invoice.pdf",
  mimetype: "application/pdf",
  caption: "April invoice",
});
```

## Send a location

```ts
await client.messages.sendLocation({
  phone_number: "+6281234567890",
  whatsapp_account_id: "your-whatsapp-account-id",
  latitude: -6.2088,
  longitude: 106.8456,
  location_title: "Jakarta",
  location_address: "Indonesia",
});
```

## Send a contact card

```ts
await client.messages.sendContact({
  phone_number: "+6281234567890",
  whatsapp_account_id: "your-whatsapp-account-id",
  contacts: [{ name: "Alice", phone_number: "+6281234567891" }],
});
```

## Send interactive buttons

```ts
await client.messages.sendButtons({
  phone_number: "+6281234567890",
  whatsapp_account_id: "your-whatsapp-account-id",
  body: "Choose an option:",
  buttons: [
    { id: "yes", title: "Yes" },
    { id: "no", title: "No" },
  ],
  footer: "Powered by WazzAPI",
});
```

## Send an interactive list

```ts
await client.messages.sendList({
  phone_number: "+6281234567890",
  whatsapp_account_id: "your-whatsapp-account-id",
  body: "Select a plan:",
  button_text: "View plans",
  sections: [
    {
      title: "Plans",
      rows: [
        { id: "basic", title: "Basic", description: "$9/mo" },
        { id: "pro", title: "Pro", description: "$29/mo" },
      ],
    },
  ],
});
```

## List messages

```ts
const response = await client.messages.list({ limit: 50, status: "sent" });

for (const message of response.messages) {
  console.log(message.id, message.status, message.phone_number);
}
```

## Get a message

```ts
const message = await client.messages.get("msg-id");
console.log(message.status, message.content);
```

## Retry a failed message

```ts
const result = await client.messages.retry("msg-id");
console.log(result.status);
```

## Cancel a scheduled message

```ts
const result = await client.messages.cancel("msg-id");
console.log(result.status);
```

## Lookup by WhatsApp message ID

```ts
const message = await client.messages.lookup("wamid.xxx");
console.log(message.id);
```

## Message stats

```ts
const stats = await client.messages.stats();
console.log(stats.total, stats.by_status);
```
