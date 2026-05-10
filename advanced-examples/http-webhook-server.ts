/// <reference types="node" />

import { Buffer } from "node:buffer";
import { createServer, type IncomingMessage } from "node:http";

import {
	EVENT_HEADER,
	EVENT_ID_HEADER,
	SIGNATURE_HEADER,
	WebhookHandler,
} from "../src";

function requireEnv(name: string): string {
	const value = process.env[name];
	if (!value) {
		throw new Error(`Missing required environment variable: ${name}`);
	}

	return value;
}

function readRequestBody(request: IncomingMessage): Promise<Buffer> {
	return new Promise((resolve, reject) => {
		const chunks: Buffer[] = [];

		request.on("data", (chunk: Buffer | string) => {
			chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
		});
		request.on("end", () => resolve(Buffer.concat(chunks)));
		request.on("error", reject);
	});
}

const handler = new WebhookHandler(requireEnv("WAZZAPI_WEBHOOK_SECRET"));
const port = Number(process.env.PORT || 3000);

const server = createServer(async (request, response) => {
	if (request.method !== "POST" || request.url !== "/webhooks/wazzapi") {
		response.statusCode = 404;
		response.end("Not Found");
		return;
	}

	try {
		const rawBody = await readRequestBody(request);
		const headers = {
			[SIGNATURE_HEADER]: request.headers[
				SIGNATURE_HEADER.toLowerCase()
			] as string,
			[EVENT_HEADER]: request.headers[EVENT_HEADER.toLowerCase()] as string,
			[EVENT_ID_HEADER]: request.headers[
				EVENT_ID_HEADER.toLowerCase()
			] as string,
		};

		const event = handler.verifyAndParse(rawBody, headers);
		console.log(`received ${event.event_type}`);
		console.log(event.data);

		response.statusCode = 200;
		response.setHeader("content-type", "application/json");
		response.end(JSON.stringify({ ok: true }));
	} catch (error) {
		console.error(error);
		response.statusCode = 400;
		response.setHeader("content-type", "application/json");
		response.end(
			JSON.stringify({
				ok: false,
				error: error instanceof Error ? error.message : "unknown error",
			}),
		);
	}
});

server.listen(port, () => {
	console.log(
		`Webhook server listening on http://localhost:${port}/webhooks/wazzapi`,
	);
});
