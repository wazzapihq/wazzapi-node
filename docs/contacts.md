# Contacts

Manage contacts and contact groups.

## List contacts

```ts
import { WazzapiClient } from "wazzapi";

const client = new WazzapiClient({ apiKey: process.env.WAZZAPI_API_KEY });
const response = await client.contacts.list({ limit: 50, search: "alice" });

for (const contact of response.contacts) {
  console.log(contact.name, contact.phone_number);
}
```

## Get a contact

```ts
const contact = await client.contacts.get("contact-id");
console.log(contact.phone_number, contact.tags);
```

## Create a contact

```ts
const contact = await client.contacts.create({
  phone_number: "+6281234567890",
  name: "Alice",
  tags: ["customer", "vip"],
});

console.log(contact.id);
```

## Update a contact

```ts
const contact = await client.contacts.update("contact-id", {
  name: "Alice Smith",
  tags: ["customer"],
});

console.log(contact.name);
```

## Delete a contact

```ts
await client.contacts.delete("contact-id");
```

## Bulk delete

```ts
const result = await client.contacts.bulkDelete({
  contact_ids: ["id-1", "id-2"],
});

console.log(result.deleted);
```

## Contact groups

### List groups

```ts
const response = await client.contacts.listGroups({ limit: 20 });

for (const group of response.groups) {
  console.log(group.name, group.member_count);
}
```

### Create a group

```ts
const group = await client.contacts.createGroup({
  name: "VIP Customers",
  description: "Top tier",
});

console.log(group.id);
```

### Get a group with members

```ts
const response = await client.contacts.getGroup("group-id");
console.log(response.group.name);

for (const contact of response.contacts) {
  console.log(contact.name);
}
```

### Update a group

```ts
const group = await client.contacts.updateGroup("group-id", {
  name: "Updated Name",
});

console.log(group.name);
```

### Delete a group

```ts
await client.contacts.deleteGroup("group-id");
```

### Add contacts to a group

```ts
const result = await client.contacts.addToGroup("group-id", {
  contact_ids: ["contact-1", "contact-2"],
});

console.log(result.added);
```

### Remove contacts from a group

```ts
const result = await client.contacts.removeFromGroup("group-id", {
  contact_ids: ["contact-1"],
});

console.log(result.added);
```

## Import and export

### Import from CSV

```ts
const result = await client.contacts.importCsv({
  csv_content: "phone_number,name\n+6281234567890,Alice",
  skip_duplicates: true,
});

console.log(result.imported, result.updated, result.errors);
```

### Export to CSV

```ts
const result = await client.contacts.exportCsv({ group_id: "group-id" });
console.log(result.csv_data);
```

### Get import template

```ts
const template = await client.contacts.importTemplate();
console.log(template);
```

## Sync contacts from WhatsApp

### Start sync

```ts
const result = await client.contacts.sync({
  whatsapp_account_id: "wa-123",
  sync_type: "full",
});

console.log(result.job_id, result.status);
```

### Check sync status

```ts
const statuses = await client.contacts.syncStatus();
for (const status of statuses) {
  console.log(
    status.account_name,
    status.last_sync_status,
    status.contacts_synced_count,
  );
}
```

### Sync history

```ts
const response = await client.contacts.syncHistory({ limit: 10 });
for (const item of response.history) {
  console.log(item.account_name, item.status, item.contacts_count);
}
```
