# Templates

Create and manage reusable message templates.

## List templates

```ts
import { WazzapiClient } from "wazzapi";

const client = new WazzapiClient({ apiKey: process.env.WAZZAPI_API_KEY });
const response = await client.templates.list({
  limit: 20,
  category: "marketing",
});

for (const template of response.data) {
  console.log(template.name, template.variables);
}
```

## Get a template

```ts
const template = await client.templates.get("template-id");
console.log(template.content, template.variables);
```

## Create a template

```ts
const template = await client.templates.create({
  name: "welcome-message",
  category: "marketing",
  content: "Hi {{name}}, welcome to WazzAPI!",
});

console.log(template.id);
```

## Update a template

```ts
const template = await client.templates.update("template-id", {
  content: "Hi {{name}}, welcome! Your code is {{code}}.",
});

console.log(template.content);
```

## Delete a template

```ts
await client.templates.delete("template-id");
```

## Preview a template

```ts
const preview = await client.templates.preview({
  content: "Hi {{name}}, your code is {{code}}.",
  custom_variables: { name: "Alice", code: "WZ-1234" },
});

console.log(preview.preview);
console.log(preview.missing_variables);
```

## Built-in variables

```ts
const response = await client.templates.builtinVariables();

for (const variable of response.variables) {
  console.log(variable.name, variable.description, variable.example);
}
```
