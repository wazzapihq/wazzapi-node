import { describe, expect, test } from "bun:test";

import {
	EVENT_HEADER,
	EVENT_ID_HEADER,
	generateWebhookSignature,
	parseWebhook,
	SIGNATURE_HEADER,
	verifyWebhookSignature,
	WazzapiWebhookParseError,
	WazzapiWebhookVerificationError,
	WebhookHandler,
} from "../src";

const SECRET = "super-secret";

const MESSAGE_PAYLOAD = {
	id: "97e1d724-f38d-46f6-bc4c-d9e0f4cf9285",
	event_type: "message.received",
	timestamp: "2026-04-26T09:15:30Z",
	organization_id: "0f1d6e38-d6bc-49be-9c39-1fcf2f946d7e",
	webhook_id: "a17d6351-d8f6-4cd8-ae0e-fce090afdb8f",
	data: {
		message_id: "f4fd147d-e2a8-4d52-9eb5-98a72f5b90ab",
		whatsapp_message_id: "wamid.123",
		phone_number: "6281234567890",
		account_name: "Support Device",
		status: "delivered",
		direction: "inbound",
		message_type: "text",
		failure_reason: null,
		reason: null,
		sent_at: null,
		delivered_at: "2026-04-26T09:15:29Z",
		read_at: null,
		failed_at: null,
		whatsapp_account_id: "c053d8ef-6c19-4ecb-9cc5-a4a64be79d92",
		campaign_id: null,
		batch_id: null,
	},
};

function encode(payload: unknown): string {
	return JSON.stringify(payload);
}

describe("webhooks", () => {
	test("generate and verify signature", () => {
		const payload = encode(MESSAGE_PAYLOAD);
		const signature = generateWebhookSignature(payload, SECRET);

		expect(signature.startsWith("sha256=")).toBe(true);
		expect(verifyWebhookSignature(payload, signature, SECRET)).toBe(true);
		expect(verifyWebhookSignature(payload, "sha256=deadbeef", SECRET)).toBe(
			false,
		);
	});

	test("verifies and parses message webhook", () => {
		const payload = encode(MESSAGE_PAYLOAD);
		const handler = new WebhookHandler(SECRET);
		const headers = {
			[SIGNATURE_HEADER]: handler.generateSignature(payload),
			[EVENT_HEADER]: "message.received",
			[EVENT_ID_HEADER]: "evt_1",
		};

		const parsed = handler.verifyAndParse(payload, headers);
		expect(parsed.event_type).toBe("message.received");
		expect(parsed.data.phone_number).toBe("6281234567890");
		expect(parsed.timestamp instanceof Date).toBe(true);
	});

	test("parseWebhook helper works", () => {
		const payload = encode(MESSAGE_PAYLOAD);
		const handler = new WebhookHandler(SECRET);
		const headers = {
			[SIGNATURE_HEADER]: handler.generateSignature(payload),
			[EVENT_HEADER]: "message.received",
			[EVENT_ID_HEADER]: "evt_1",
		};

		const parsed = parseWebhook(payload, headers, SECRET);
		expect(parsed.event_type).toBe("message.received");
	});

	test("rejects invalid headers", () => {
		const payload = encode(MESSAGE_PAYLOAD);
		const handler = new WebhookHandler(SECRET);

		expect(() => {
			handler.verifyAndParse(payload, {});
		}).toThrow(WazzapiWebhookVerificationError);
	});

	test("rejects invalid json", () => {
		const handler = new WebhookHandler(SECRET);
		const payload = "not-json";
		const headers = {
			[SIGNATURE_HEADER]: handler.generateSignature(payload),
			[EVENT_HEADER]: "message.received",
			[EVENT_ID_HEADER]: "evt_1",
		};

		expect(() => {
			handler.verifyAndParse(payload, headers);
		}).toThrow(WazzapiWebhookParseError);
	});
});
