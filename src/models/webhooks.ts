import { cloneObject, type WazzapiModel, withDateFields } from "./base";

export type MessageWebhookEvent =
	| "message.received"
	| "message.sent"
	| "message.delivered"
	| "message.read"
	| "message.failed";

export type DeviceWebhookEvent = "device.connected" | "device.disconnected";
export type WebhookEvent = MessageWebhookEvent | DeviceWebhookEvent;

export interface PublicWebhookMessageData extends WazzapiModel {
	message_id: string;
	whatsapp_message_id?: string | null;
	phone_number: string;
	account_name?: string | null;
	status: string;
	direction: string;
	message_type: string;
	failure_reason?: string | null;
	reason?: string | null;
	sent_at?: Date | null;
	delivered_at?: Date | null;
	read_at?: Date | null;
	failed_at?: Date | null;
	whatsapp_account_id: string;
	campaign_id?: string | null;
	batch_id?: string | null;
}

export interface PublicWebhookDeviceData extends WazzapiModel {
	message_id: string;
	whatsapp_message_id?: string | null;
	phone_number: string;
	account_name?: string | null;
	status: string;
	direction: string;
	message_type: string;
	failure_reason?: string | null;
	reason?: string | null;
	sent_at?: Date | null;
	delivered_at?: Date | null;
	read_at?: Date | null;
	failed_at?: Date | null;
	whatsapp_account_id: string;
	campaign_id?: string | null;
	batch_id?: string | null;
}

export interface PublicMessageWebhook extends WazzapiModel {
	id: string;
	event_type: MessageWebhookEvent;
	timestamp: Date;
	organization_id: string;
	webhook_id: string;
	data: PublicWebhookMessageData;
}

export interface PublicDeviceWebhook extends WazzapiModel {
	id: string;
	event_type: DeviceWebhookEvent;
	timestamp: Date;
	organization_id: string;
	webhook_id: string;
	data: PublicWebhookDeviceData;
}

export type WebhookPayload = PublicMessageWebhook | PublicDeviceWebhook;

export function parsePublicWebhookMessageData(
	input: unknown,
): PublicWebhookMessageData {
	return withDateFields<PublicWebhookMessageData>(input, [
		"sent_at",
		"delivered_at",
		"read_at",
		"failed_at",
	]);
}

export function parsePublicWebhookDeviceData(
	input: unknown,
): PublicWebhookDeviceData {
	return withDateFields<PublicWebhookDeviceData>(input, [
		"sent_at",
		"delivered_at",
		"read_at",
		"failed_at",
	]);
}

export function parsePublicMessageWebhook(
	input: unknown,
): PublicMessageWebhook {
	const output = withDateFields<PublicMessageWebhook>(input, ["timestamp"]);
	const typedInput =
		typeof input === "object" && input
			? (input as { data?: unknown })
			: undefined;
	output.data = parsePublicWebhookMessageData(typedInput?.data);
	return output;
}

export function parsePublicDeviceWebhook(input: unknown): PublicDeviceWebhook {
	const output = withDateFields<PublicDeviceWebhook>(input, ["timestamp"]);
	const typedInput =
		typeof input === "object" && input
			? (input as { data?: unknown })
			: undefined;
	output.data = parsePublicWebhookDeviceData(typedInput?.data);
	return output;
}

export function parseWebhookPayload(input: unknown): WebhookPayload {
	const output = cloneObject<WazzapiModel>(input);
	if (typeof output.event_type !== "string") {
		const error = new TypeError("Webhook payload is missing event_type");
		throw error;
	}
	if (output.event_type.startsWith("message.")) {
		return parsePublicMessageWebhook(output);
	}
	if (output.event_type.startsWith("device.")) {
		return parsePublicDeviceWebhook(output);
	}
	throw new TypeError(`Unsupported webhook event type: ${output.event_type}`);
}
