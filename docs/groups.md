# Groups

Manage WhatsApp groups.

## List groups

```ts
import { WazzapiClient } from "wazzapi";

const client = new WazzapiClient({ apiKey: process.env.WAZZAPI_API_KEY });
const response = await client.groups.list({ session_name: "main", limit: 50 });

for (const group of response.groups) {
  console.log(group.id, group.name, group.participants_count);
}
```

## Get a group

```ts
const group = await client.groups.get("123456789@g.us", {
  session_name: "main",
});

console.log(group.name, group.description);
```

## Get group participants

```ts
const response = await client.groups.getParticipants("123456789@g.us", {
  session_name: "main",
});

for (const participant of response.participants) {
  console.log(participant.id, participant.is_admin, participant.is_super_admin);
}
```

## Create a group

```ts
const result = await client.groups.create({
  session_name: "main",
  name: "My New Group",
  participants: ["+6281234567890", "+6281234567891"],
});

console.log(result.jid);
```

## Send text to a group

```ts
const result = await client.groups.sendText({
  session_name: "main",
  group_jid: "123456789@g.us",
  text: "Hello everyone!",
});

console.log(result.message_id);
```

## Send media to a group

```ts
const result = await client.groups.sendMedia({
  session_name: "main",
  group_jid: "123456789@g.us",
  media_url: "https://example.com/image.jpg",
  media_type: "image",
  caption: "Group photo",
});

console.log(result.message_id);
```

## Add a participant

```ts
const result = await client.groups.addParticipant("123456789@g.us", {
  session_name: "main",
  participant_jid: "6281234567890@s.whatsapp.net",
});

console.log(result.details);
```

## Remove a participant

```ts
const result = await client.groups.removeParticipant("123456789@g.us", {
  session_name: "main",
  participant_jid: "6281234567890@s.whatsapp.net",
});

console.log(result.details);
```

## Update participants

```ts
const result = await client.groups.updateParticipants({
  session_name: "main",
  group_jid: "123456789@g.us",
  action: "promote",
  participants: ["6281234567890@s.whatsapp.net"],
});

console.log(result.details);
```

## Get invite link

```ts
const result = await client.groups.getInviteLink("123456789@g.us", {
  session_name: "main",
});

console.log(result.invite_link);
```

## Get invite info

```ts
const result = await client.groups.getInviteInfo({
  session_name: "main",
  invite_link: "https://chat.whatsapp.com/AbCdEfGh",
});

console.log(result.jid, result.name);
```

## Join a group

```ts
const result = await client.groups.join({
  session_name: "main",
  invite_link: "https://chat.whatsapp.com/AbCdEfGh",
});

console.log(result.details);
```

## Leave a group

```ts
const result = await client.groups.leave("123456789@g.us", {
  session_name: "main",
});

console.log(result.details);
```

## Set group name

```ts
const result = await client.groups.setName("123456789@g.us", {
  session_name: "main",
  name: "New Group Name",
});

console.log(result.details);
```

## Set group topic

```ts
const result = await client.groups.setTopic("123456789@g.us", {
  session_name: "main",
  topic: "New topic description",
});

console.log(result.details);
```

## Set group photo

```ts
const result = await client.groups.setPhoto("123456789@g.us", {
  session_name: "main",
  image_data_uri: "data:image/png;base64,iVBORw0KGgo...",
});

console.log(result.details);
```

## Remove group photo

```ts
const result = await client.groups.removePhoto("123456789@g.us", {
  session_name: "main",
});

console.log(result.details);
```

## Set announce mode

Only admins can send messages when announce mode is enabled.

```ts
const result = await client.groups.setAnnounce("123456789@g.us", {
  session_name: "main",
  announce: true,
});

console.log(result.details);
```

## Set locked mode

Only admins can edit group info when locked mode is enabled.

```ts
const result = await client.groups.setLocked("123456789@g.us", {
  session_name: "main",
  locked: true,
});

console.log(result.details);
```

## Set ephemeral messages

```ts
const result = await client.groups.setEphemeral("123456789@g.us", {
  session_name: "main",
  duration: "24h",
});

console.log(result.details);
```
