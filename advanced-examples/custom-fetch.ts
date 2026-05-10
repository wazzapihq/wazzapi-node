import { WazzapiClient } from "../src";

function requireEnv(name: string): string {
	const value = process.env[name];
	if (!value) {
		throw new Error(`Missing required environment variable: ${name}`);
	}

	return value;
}

async function loggingFetch(
	input: string | URL | Request,
	init?: RequestInit,
): Promise<Response> {
	let url: string;

	if (typeof input === "string") {
		url = input;
	} else if (input instanceof URL) {
		url = input.toString();
	} else {
		url = input.url;
	}

	console.log(`[wazzapi] ${init?.method ?? "GET"} ${url}`);
	return fetch(input, init);
}

const client = new WazzapiClient({
	apiKey: requireEnv("WAZZAPI_API_KEY"),
	fetch: loggingFetch,
	timeout: 15000,
	headers: {
		"X-SDK-Example": "advanced-custom-fetch",
	},
});

const stats = await client.messages.stats();
console.log(stats);
