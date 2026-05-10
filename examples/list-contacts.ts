import { WazzapiClient } from "../src";

const client = new WazzapiClient({ apiKey: process.env.WAZZAPI_API_KEY });
const response = await client.contacts.list({ limit: 20, search: "alice" });

response.contacts.forEach((contact) => {
	console.log(contact);
});
