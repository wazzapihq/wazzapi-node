import {
	cloneObject,
	mapArray,
	type WazzapiModel,
	withDateFields,
} from "./base";

export interface ConversationItem extends WazzapiModel {
	id: string;
	whatsapp_account_id: string;
	contact_id?: string | null;
	phone_number: string;
	status: string;
	assignee_user_id?: string | null;
	subject?: string | null;
	last_message_preview?: string | null;
	last_message_at?: Date | null;
	last_inbound_at?: Date | null;
	last_outbound_at?: Date | null;
	unread_count: number;
	created_at: Date;
	updated_at: Date;
}

export interface ConversationListResponse extends WazzapiModel {
	conversations: ConversationItem[];
	total: number;
	limit: number;
	offset: number;
}

export interface ConversationUpdateRequest extends WazzapiModel {
	status?: string | null;
	assignee_user_id?: string | null;
	clear_assignee?: boolean;
	mark_read?: boolean;
}

export interface ConversationMessageItem extends WazzapiModel {
	id: string;
	direction: string;
	content: string;
	status: string;
	message_type: string;
	phone_number: string;
	media_type?: string | null;
	media_url?: string | null;
	media_filename?: string | null;
	media_mimetype?: string | null;
	whatsapp_message_id?: string | null;
	created_at: Date;
	sent_at?: Date | null;
	delivered_at?: Date | null;
	read_at?: Date | null;
}

export interface ConversationMessageListResponse extends WazzapiModel {
	messages: ConversationMessageItem[];
	total: number;
	limit: number;
	offset: number;
}

export interface ConversationReplyRequest extends WazzapiModel {
	content?: string | null;
	caption?: string | null;
	message_type?: string;
	media_url?: string | null;
	media_base64?: string | null;
	media_type?: string | null;
	filename?: string | null;
	mimetype?: string | null;
	whatsapp_account_id?: string | null;
}

export interface ConversationReplyResponse extends WazzapiModel {
	success: boolean;
	message_id: string;
	conversation_id: string;
	status: string;
	message_type?: string;
}

export function parseConversationItem(input: unknown): ConversationItem {
	return withDateFields<ConversationItem>(input, [
		"last_message_at",
		"last_inbound_at",
		"last_outbound_at",
		"created_at",
		"updated_at",
	]);
}

export function parseConversationListResponse(
	input: unknown,
): ConversationListResponse {
	const output = cloneObject<ConversationListResponse>(input);
	const typed =
		typeof input === "object" && input
			? (input as { conversations?: unknown })
			: undefined;
	output.conversations = mapArray(typed?.conversations, parseConversationItem);
	return output;
}

export function parseConversationMessageItem(
	input: unknown,
): ConversationMessageItem {
	return withDateFields<ConversationMessageItem>(input, [
		"created_at",
		"sent_at",
		"delivered_at",
		"read_at",
	]);
}

export function parseConversationMessageListResponse(
	input: unknown,
): ConversationMessageListResponse {
	const output = cloneObject<ConversationMessageListResponse>(input);
	const typed =
		typeof input === "object" && input
			? (input as { messages?: unknown })
			: undefined;
	output.messages = mapArray(typed?.messages, parseConversationMessageItem);
	return output;
}

export function parseConversationReplyResponse(
	input: unknown,
): ConversationReplyResponse {
	return cloneObject<ConversationReplyResponse>(input);
}
