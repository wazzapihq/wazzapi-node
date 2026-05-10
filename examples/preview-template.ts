import { WazzapiClient } from "../src";

const client = new WazzapiClient({ apiKey: process.env.WAZZAPI_API_KEY });
const preview = await client.templates.preview({
	content: "Hi {{name}}, your code is {{code}}.",
	custom_variables: { name: "Alice", code: "WZ-1234" },
});

console.log(preview);
