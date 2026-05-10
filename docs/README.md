# WazzAPI Node SDK Docs

Official documentation for the WazzAPI Node.js and TypeScript SDK.

## What you can do

- Send direct WhatsApp messages, including text, image, video, voice, document, location, contact cards, buttons, and lists
- Manage WhatsApp groups, including participants, invite links, and group settings
- Manage contacts and contact groups
- Create, preview, update, and delete reusable templates
- Verify and parse incoming webhook payloads
- Download and decrypt encrypted WhatsApp media files
- Work with typed request and response models in TypeScript

## Requirements

- Node.js 20+
- A WazzAPI account
- A WazzAPI API key

## Install

With Bun:

```bash
bun add wazzapi
```

With npm:

```bash
npm install wazzapi
```

## Quick start

```ts
import { WazzapiClient } from "wazzapi";

const client = new WazzapiClient({ apiKey: process.env.WAZZAPI_API_KEY });

const response = await client.messages.send({
  phone_number: "+6281234567890",
  whatsapp_account_id: "your-whatsapp-account-id",
  content: "Hello from WazzAPI!",
});

console.log(response.message_id);
```

## Topics

- [Authentication](./authentication.md)
- [Client](./client.md)
- [Messages](./messages.md)
- [Groups](./groups.md)
- [Contacts](./contacts.md)
- [Templates](./templates.md)
- [Webhooks](./webhooks.md)
- [Media](./media.md)
- [Errors](./errors.md)
