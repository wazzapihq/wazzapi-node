import { WazzapiClient } from "../src";

const client = new WazzapiClient({ apiKey: process.env.WAZZAPI_API_KEY });
const template = await client.templates.create({
	name: "welcome-message",
	category: "marketing",
	content: "Hi {{name}}, welcome to WazzAPI!",
});

console.log(template);
