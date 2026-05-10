import { describe, expect, test } from "bun:test";

import {
	__version__,
	generateWebhookSignature,
	type SendMessageRequest,
	WazzapiClient,
	WebhookHandler,
} from "../src";

describe("smoke", () => {
	test("basic exports are wired", () => {
		expect(__version__).toBe("0.2.0");

		const client = new WazzapiClient({ apiKey: "smoke-test-token" });
		expect(client.http.baseUrl).toBe("https://api.wazzapi.com");
		expect(client.http.headers.Authorization).toBe("Bearer smoke-test-token");

		const request: SendMessageRequest = {
			phone_number: "+6281234567890",
			whatsapp_account_id: "wa_123",
			content: "smoke test",
		};

		expect(request.phone_number).toBe("+6281234567890");
		expect(request.content).toBe("smoke test");

		const handler = new WebhookHandler("secret");
		const signature = generateWebhookSignature("{}", "secret");
		expect(handler.verifySignature("{}", signature)).toBe(true);
	});
});
