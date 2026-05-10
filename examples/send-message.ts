import { WazzapiClient } from "../src";

const client = new WazzapiClient({ apiKey: process.env.WAZZAPI_API_KEY });
const response = await client.messages.send({
	phone_number: "+6281234567890",
	whatsapp_account_id: "your-whatsapp-account-id",
	content: "Hello from WazzAPI!",
});

console.log(response);
