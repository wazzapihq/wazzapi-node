import { createHmac, timingSafeEqual } from "node:crypto";

import {
	parsePublicDeviceWebhook,
	parsePublicMessageWebhook,
	type WebhookPayload,
} from "./models";

type RawPayload = Buffer | Uint8Array | string;
type WebhookHeaders = Record<string, string> | Headers;

export const SIGNATURE_HEADER = "X-Wazzapi-Signature";
export const EVENT_HEADER = "X-Wazzapi-Event";
export const EVENT_ID_HEADER = "X-Wazzapi-Event-ID";

const SIGNATURE_PREFIX = "sha256=";

export class WazzapiWebhookError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "WazzapiWebhookError";
		Object.setPrototypeOf(this, new.target.prototype);
	}
}

export class WazzapiWebhookVerificationError extends WazzapiWebhookError {
	constructor(message: string) {
		super(message);
		this.name = "WazzapiWebhookVerificationError";
	}
}

export class WazzapiWebhookParseError extends WazzapiWebhookError {
	constructor(message: string) {
		super(message);
		this.name = "WazzapiWebhookParseError";
	}
}

function toBuffer(payload: RawPayload): Buffer {
	if (typeof payload === "string") {
		return Buffer.from(payload, "utf8");
	}

	return Buffer.from(payload);
}

function getHeader(headers: WebhookHeaders, name: string): string | undefined {
	const normalizedName = name.toLowerCase();

	if (typeof Headers !== "undefined" && headers instanceof Headers) {
		return headers.get(name) ?? undefined;
	}

	return Object.entries(headers).find(
		([key]) => key.toLowerCase() === normalizedName,
	)?.[1];
}

export function generateWebhookSignature(
	payload: RawPayload,
	secret: string,
): string {
	const digest = createHmac("sha256", Buffer.from(secret, "utf8"))
		.update(toBuffer(payload))
		.digest("hex");
	return `${SIGNATURE_PREFIX}${digest}`;
}

export function verifyWebhookSignature(
	payload: RawPayload,
	signature: string,
	secret: string,
): boolean {
	const normalizedSignature = signature.trim();
	const expected = Buffer.from(
		generateWebhookSignature(payload, secret),
		"utf8",
	);
	const actual = Buffer.from(normalizedSignature, "utf8");

	if (expected.length !== actual.length) {
		return false;
	}

	return timingSafeEqual(expected, actual);
}

export class WebhookHandler {
	readonly secret: string;

	constructor(secret: string) {
		this.secret = secret;
	}

	generateSignature(payload: RawPayload): string {
		return generateWebhookSignature(payload, this.secret);
	}

	verifySignature(payload: RawPayload, signature: string): boolean {
		return verifyWebhookSignature(payload, signature, this.secret);
	}

	verifyHeaders(payload: RawPayload, headers: WebhookHeaders): void {
		const signature = getHeader(headers, SIGNATURE_HEADER);
		if (!signature) {
			throw new WazzapiWebhookVerificationError(
				`Missing required webhook header: ${SIGNATURE_HEADER}`,
			);
		}
		if (!this.verifySignature(payload, signature)) {
			throw new WazzapiWebhookVerificationError("Invalid webhook signature");
		}
		if (!getHeader(headers, EVENT_HEADER)) {
			throw new WazzapiWebhookVerificationError(
				`Missing required webhook header: ${EVENT_HEADER}`,
			);
		}
		if (!getHeader(headers, EVENT_ID_HEADER)) {
			throw new WazzapiWebhookVerificationError(
				`Missing required webhook header: ${EVENT_ID_HEADER}`,
			);
		}
	}

	parse(payload: RawPayload): WebhookPayload {
		let rawPayload: unknown;

		try {
			rawPayload = JSON.parse(toBuffer(payload).toString("utf8"));
		} catch {
			throw new WazzapiWebhookParseError("Webhook payload is not valid JSON");
		}

		if (
			!rawPayload ||
			typeof rawPayload !== "object" ||
			Array.isArray(rawPayload)
		) {
			throw new WazzapiWebhookParseError(
				"Webhook payload must be a JSON object",
			);
		}

		const eventType = (rawPayload as { event_type?: unknown }).event_type;
		if (typeof eventType !== "string") {
			throw new WazzapiWebhookParseError(
				"Webhook payload is missing event_type",
			);
		}

		if (eventType.startsWith("message.")) {
			return parsePublicMessageWebhook(rawPayload);
		}
		if (eventType.startsWith("device.")) {
			return parsePublicDeviceWebhook(rawPayload);
		}

		throw new WazzapiWebhookParseError(
			`Unsupported webhook event type: ${eventType}`,
		);
	}

	verifyAndParse(payload: RawPayload, headers: WebhookHeaders): WebhookPayload {
		this.verifyHeaders(payload, headers);

		const parsed = this.parse(payload);
		const headerEvent = getHeader(headers, EVENT_HEADER);
		if (headerEvent && headerEvent !== parsed.event_type) {
			throw new WazzapiWebhookVerificationError(
				"Webhook event header does not match payload event_type",
			);
		}

		return parsed;
	}
}

export function parseWebhook(
	payload: RawPayload,
	headers: WebhookHeaders,
	secret: string,
): WebhookPayload {
	return new WebhookHandler(secret).verifyAndParse(payload, headers);
}

export const generate_webhook_signature = generateWebhookSignature;
export const verify_webhook_signature = verifyWebhookSignature;
export const parse_webhook = parseWebhook;
