import { cloneObject, mapArray, type WazzapiModel } from "./base";

export interface CampaignCreateRequest extends WazzapiModel {
	name: string;
	whatsapp_account_id: string;
	recipient_type: string;
	description?: string | null;
	template_id?: string | null;
	message_type?: string;
	custom_message?: string | null;
	message_payload?: Record<string, unknown> | null;
	recipient_group_ids?: string[] | null;
	recipient_contact_ids?: string[] | null;
	scheduled_for?: string | Date | null;
}

export interface CampaignUpdateRequest extends WazzapiModel {
	name?: string | null;
	description?: string | null;
	template_id?: string | null;
	message_type?: string | null;
	custom_message?: string | null;
	message_payload?: Record<string, unknown> | null;
	recipient_type?: string | null;
	recipient_group_ids?: string[] | null;
	recipient_contact_ids?: string[] | null;
	scheduled_for?: string | Date | null;
}

export interface CampaignItem extends WazzapiModel {
	id: string;
	name: string;
	status: string;
	recipient_type: string;
	total_recipients: number;
	messages_sent: number;
	messages_delivered: number;
	messages_failed: number;
	whatsapp_account_id: string;
	message_type?: string;
	recipient_contact_ids?: string[] | null;
	scheduled_for?: string | null;
	created_at: string;
}

export interface CampaignListResponse extends WazzapiModel {
	items: CampaignItem[];
	total: number;
	limit: number;
	offset: number;
}

export interface CampaignResponse extends WazzapiModel {
	id: string;
	name: string;
	status: string;
	description?: string | null;
	whatsapp_account_id: string;
	template_id?: string | null;
	message_type?: string;
	custom_message?: string | null;
	message_payload?: Record<string, unknown> | null;
	recipient_type: string;
	recipient_group_ids?: string[] | null;
	recipient_contact_ids?: string[] | null;
	total_recipients?: number;
	messages_sent?: number;
	messages_delivered?: number;
	messages_failed?: number;
	scheduled_for?: string | null;
	created_at?: string | null;
	updated_at?: string | null;
}

export interface CampaignActionResponse extends WazzapiModel {
	success: boolean;
	campaign_id: string;
	status: string;
}

export interface CampaignExecuteResponse extends WazzapiModel {
	success: boolean;
	campaign_id: string;
	status: string;
	total_recipients: number;
	job_id?: string | null;
}

export function parseCampaignItem(input: unknown): CampaignItem {
	return cloneObject<CampaignItem>(input);
}

export function parseCampaignListResponse(input: unknown): CampaignListResponse {
	const output = cloneObject<CampaignListResponse>(input);
	const typed =
		typeof input === "object" && input
			? (input as { items?: unknown })
			: undefined;
	output.items = mapArray(typed?.items, parseCampaignItem);
	return output;
}

export function parseCampaignResponse(input: unknown): CampaignResponse {
	return cloneObject<CampaignResponse>(input);
}

export function parseCampaignActionResponse(
	input: unknown,
): CampaignActionResponse {
	return cloneObject<CampaignActionResponse>(input);
}

export function parseCampaignExecuteResponse(
	input: unknown,
): CampaignExecuteResponse {
	return cloneObject<CampaignExecuteResponse>(input);
}
