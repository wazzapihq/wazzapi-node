import { WazzapiClient } from "../src";

const client = new WazzapiClient({ apiKey: process.env.WAZZAPI_API_KEY });
const response = await client.devices.list({
	limit: 20,
	status: "connected",
	sort_by: "created_at",
	sort_order: "desc",
});

response.devices.forEach((device) => {
	console.log(device.id, device.name, device.status, device.phone_number);
});
