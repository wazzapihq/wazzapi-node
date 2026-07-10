import {
	cloneObject,
	mapArray,
	type WazzapiModel,
	withDateFields,
} from "./base";

type ValueMap = Record<string, unknown>;

export interface InteractiveButton extends WazzapiModel {
	id: string;
	title: string;
}

export interface ButtonReplyRequest extends WazzapiModel {
	phone_number: string;
	body: string;
	buttons: InteractiveButton[];
	whatsapp_account_id: string;
	footer?: string | null;
	contact_id?: string | null;
}

export interface CancelMessageResponse extends WazzapiModel {
	success: boolean;
	message_id: string;
	status: string;
}

export interface InteractiveMessageResponse extends WazzapiModel {
	success: boolean;
	message_id: string;
	status: string;
	run_id?: string | null;
}

export interface InteractiveRow extends WazzapiModel {
	id: string;
	title: string;
	description?: string | null;
}

export interface InteractiveSection extends WazzapiModel {
	title: string;
	rows: InteractiveRow[];
}

export interface ListReplyRequest extends WazzapiModel {
	phone_number: string;
	body: string;
	button_text: string;
	sections: InteractiveSection[];
	whatsapp_account_id: string;
	footer?: string | null;
	contact_id?: string | null;
}

export interface MessageItem extends WazzapiModel {
	id: string;
	phone_number: string;
	content: string;
	message_type: string;
	media_type?: string | null;
	media_url?: string | null;
	status: string;
	direction: string;
	retry_count: number;
	contact_id?: string | null;
	contact_name?: string | null;
	whatsapp_account_id: string;
	campaign_id?: string | null;
	batch_id?: string | null;
	scheduled_for?: Date | null;
	created_at: Date;
	sent_at?: Date | null;
	delivered_at?: Date | null;
	read_at?: Date | null;
}

export interface MessageListResponse extends WazzapiModel {
	messages: MessageItem[];
	total_count: number;
	has_more: boolean;
	current_page: number;
	total_pages: number;
}

export interface MessageResponse extends WazzapiModel {
	id: string;
	phone_number: string;
	content: string;
	message_type: string;
	media_type?: string | null;
	media_url?: string | null;
	status: string;
	direction: string;
	failure_reason?: string | null;
	retry_count: number;
	whatsapp_message_id?: string | null;
	variable_values?: ValueMap | null;
	contact_id?: string | null;
	contact_name?: string | null;
	whatsapp_account_id: string;
	campaign_id?: string | null;
	batch_id?: string | null;
	scheduled_for?: Date | null;
	queued_at?: Date | null;
	sent_at?: Date | null;
	delivered_at?: Date | null;
	read_at?: Date | null;
	failed_at?: Date | null;
	created_at: Date;
	updated_at: Date;
}

export interface MessageStatsResponse extends WazzapiModel {
	total: number;
	by_status: { [key: string]: number };
	by_direction: { [key: string]: number };
	last_7_days: number;
	last_30_days: number;
}

export interface RetryMessageResponse extends WazzapiModel {
	success: boolean;
	message_id: string;
	run_id?: string | null;
	status: string;
}

export interface SendMessageRequest extends WazzapiModel {
	phone_number: string;
	whatsapp_account_id: string;
	content?: string | null;
	template_id?: string | null;
	custom_variables?: ValueMap | null;
	message_type?: string;
	media_type?: string | null;
	media_url?: string | null;
	media_base64?: string | null;
	filename?: string | null;
	mimetype?: string | null;
	caption?: string | null;
	latitude?: number | null;
	longitude?: number | null;
	location_title?: string | null;
	location_address?: string | null;
	contacts?: ValueMap[] | null;
	contact_id?: string | null;
	scheduled_for?: Date | string | null;
	validate_phone?: boolean;
	status_callback_url?: string | null;
}

export interface SendMessageResponse extends WazzapiModel {
	success: boolean;
	message_id: string;
	status: string;
	run_id?: string | null;
}

export function parseInteractiveButton(input: unknown): InteractiveButton {
	return cloneObject<InteractiveButton>(input);
}

export function parseCancelMessageResponse(
	input: unknown,
): CancelMessageResponse {
	return cloneObject<CancelMessageResponse>(input);
}

export function parseInteractiveMessageResponse(
	input: unknown,
): InteractiveMessageResponse {
	return cloneObject<InteractiveMessageResponse>(input);
}

export function parseInteractiveRow(input: unknown): InteractiveRow {
	return cloneObject<InteractiveRow>(input);
}

export function parseInteractiveSection(input: unknown): InteractiveSection {
	const output = cloneObject<InteractiveSection>(input);
	const typedInput =
		typeof input === "object" && input
			? (input as { rows?: unknown })
			: undefined;
	output.rows = mapArray(typedInput?.rows, parseInteractiveRow);
	return output;
}

export function parseMessageItem(input: unknown): MessageItem {
	const output = withDateFields<MessageItem>(input, [
		"scheduled_for",
		"created_at",
		"sent_at",
		"delivered_at",
		"read_at",
	]);
	output.message_type ??= "text";
	return output;
}

export function parseMessageListResponse(input: unknown): MessageListResponse {
	const output = cloneObject<MessageListResponse>(input);
	const typedInput =
		typeof input === "object" && input
			? (input as { messages?: unknown })
			: undefined;
	output.messages = mapArray(typedInput?.messages, parseMessageItem);
	return output;
}

export function parseMessageResponse(input: unknown): MessageResponse {
	const output = withDateFields<MessageResponse>(input, [
		"scheduled_for",
		"queued_at",
		"sent_at",
		"delivered_at",
		"read_at",
		"failed_at",
		"created_at",
		"updated_at",
	]);
	output.message_type ??= "text";
	return output;
}

export function parseMessageStatsResponse(
	input: unknown,
): MessageStatsResponse {
	return cloneObject<MessageStatsResponse>(input);
}

export function parseRetryMessageResponse(
	input: unknown,
): RetryMessageResponse {
	return cloneObject<RetryMessageResponse>(input);
}

export function parseSendMessageResponse(input: unknown): SendMessageResponse {
	return cloneObject<SendMessageResponse>(input);
}
