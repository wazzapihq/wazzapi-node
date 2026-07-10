import {
	cloneObject,
	mapArray,
	type WazzapiModel,
	withDateFields,
} from "./base";

type StringMap = Record<string, unknown>;

export interface AddToGroupRequest extends WazzapiModel {
	contact_ids: string[];
}

export interface AddToGroupResponse extends WazzapiModel {
	success: boolean;
	added: number;
	member_count: number;
}

export interface BulkDeleteRequest extends WazzapiModel {
	contact_ids: string[];
}

export interface BulkDeleteResponse extends WazzapiModel {
	success: boolean;
	deleted: number;
}

export interface CSVExportResponse extends WazzapiModel {
	csv_data: string;
	count: number;
	filename: string;
}

export interface CSVImportRequest extends WazzapiModel {
	csv_content: string;
	skip_duplicates?: boolean | null;
}

export interface CSVImportResponse extends WazzapiModel {
	success: boolean;
	imported: number;
	updated: number;
	errors: string[];
	rows_processed: number;
}

export interface ContactCreateRequest extends WazzapiModel {
	phone_number: string;
	name?: string | null;
	email?: string | null;
	tags?: string[] | null;
	custom_fields?: StringMap | null;
}

export interface ContactGroupCreateRequest extends WazzapiModel {
	name: string;
	description?: string | null;
}

export interface ContactGroupItem extends WazzapiModel {
	id: string;
	name: string;
	description?: string | null;
	member_count: number;
	created_at: Date;
}

export interface ContactGroupListResponse extends WazzapiModel {
	groups: ContactGroupItem[];
	total: number;
	limit: number;
	offset: number;
}

export interface ContactItem extends WazzapiModel {
	id: string;
	phone_number: string;
	name?: string | null;
	email?: string | null;
	whatsapp_name?: string | null;
	profile_picture_url?: string | null;
	source: string;
	source_details?: StringMap | null;
	is_opted_out: boolean;
	tags: string[];
	last_message_at?: Date | null;
	created_at: Date;
}

export interface ContactGroupMembersResponse extends WazzapiModel {
	group: ContactGroupItem;
	contacts: ContactItem[];
	total: number;
	limit: number;
	offset: number;
}

export interface ContactGroupUpdateRequest extends WazzapiModel {
	name?: string | null;
	description?: string | null;
}

export interface ContactListResponse extends WazzapiModel {
	contacts: ContactItem[];
	total: number;
	limit: number;
	offset: number;
}

export interface ContactResponse extends WazzapiModel {
	id: string;
	phone_number: string;
	name?: string | null;
	email?: string | null;
	whatsapp_name?: string | null;
	profile_picture_url?: string | null;
	custom_fields?: StringMap | null;
	source: string;
	source_details?: StringMap | null;
	is_opted_out: boolean;
	opted_out_at?: Date | null;
	tags: string[];
	last_message_at?: Date | null;
	created_at: Date;
	updated_at: Date;
}

export interface ContactSyncHistoryItem extends WazzapiModel {
	id: string;
	account_id: string;
	account_name: string;
	sync_type: string;
	status: string;
	contacts_count: number;
	started_at: Date;
	completed_at?: Date | null;
	error_message?: string | null;
}

export interface ContactSyncHistoryResponse extends WazzapiModel {
	history: ContactSyncHistoryItem[];
	total: number;
}

export interface ContactSyncRequest extends WazzapiModel {
	whatsapp_account_id: string;
	sync_type?: string | null;
}

export interface ContactSyncResponse extends WazzapiModel {
	success: boolean;
	job_id?: string | null;
	message: string;
	status?: string | null;
}

export interface ContactSyncStatusResponse extends WazzapiModel {
	account_id: string;
	account_name: string;
	last_sync_at?: Date | null;
	last_sync_status?: string | null;
	contacts_synced_count: number;
	can_sync: boolean;
}

export interface ContactUpdateRequest extends WazzapiModel {
	name?: string | null;
	email?: string | null;
	tags?: string[] | null;
	custom_fields?: StringMap | null;
	is_opted_out?: boolean | null;
}

export interface ContactProfilePictureResponse extends WazzapiModel {
	contact_id: string;
	phone_number: string;
	url: string;
	picture_id?: string | null;
	picture_type?: string | null;
	preview: boolean;
	whatsapp_account_id: string;
	cached?: boolean;
}

export interface ContactProfilePictureImageResult extends WazzapiModel {
	content: Buffer;
	content_type?: string | null;
	final_url?: string | null;
}

export interface RemoveFromGroupRequest extends WazzapiModel {
	contact_ids: string[];
}

export function parseAddToGroupResponse(input: unknown): AddToGroupResponse {
	return cloneObject<AddToGroupResponse>(input);
}

export function parseBulkDeleteResponse(input: unknown): BulkDeleteResponse {
	return cloneObject<BulkDeleteResponse>(input);
}

export function parseCSVExportResponse(input: unknown): CSVExportResponse {
	return cloneObject<CSVExportResponse>(input);
}

export function parseCSVImportResponse(input: unknown): CSVImportResponse {
	const output = cloneObject<CSVImportResponse>(input);
	if (!Array.isArray(output.errors)) {
		output.errors = [];
	}
	return output;
}

export function parseContactGroupItem(input: unknown): ContactGroupItem {
	return withDateFields<ContactGroupItem>(input, ["created_at"]);
}

export function parseContactGroupListResponse(
	input: unknown,
): ContactGroupListResponse {
	const output = cloneObject<ContactGroupListResponse>(input);
	const typedInput =
		typeof input === "object" && input
			? (input as { groups?: unknown })
			: undefined;
	output.groups = mapArray(typedInput?.groups, parseContactGroupItem);
	return output;
}

export function parseContactItem(input: unknown): ContactItem {
	const output = withDateFields<ContactItem>(input, [
		"last_message_at",
		"created_at",
	]);
	if (!Array.isArray(output.tags)) {
		output.tags = [];
	}
	return output;
}

export function parseContactGroupMembersResponse(
	input: unknown,
): ContactGroupMembersResponse {
	const output = cloneObject<ContactGroupMembersResponse>(input);
	const typedInput =
		typeof input === "object" && input
			? (input as { group?: unknown; contacts?: unknown })
			: undefined;
	output.group = parseContactGroupItem(typedInput?.group);
	output.contacts = mapArray(typedInput?.contacts, parseContactItem);
	return output;
}

export function parseContactListResponse(input: unknown): ContactListResponse {
	const output = cloneObject<ContactListResponse>(input);
	const typedInput =
		typeof input === "object" && input
			? (input as { contacts?: unknown })
			: undefined;
	output.contacts = mapArray(typedInput?.contacts, parseContactItem);
	return output;
}

export function parseContactResponse(input: unknown): ContactResponse {
	const output = withDateFields<ContactResponse>(input, [
		"opted_out_at",
		"last_message_at",
		"created_at",
		"updated_at",
	]);
	if (!Array.isArray(output.tags)) {
		output.tags = [];
	}
	return output;
}

export function parseContactSyncHistoryItem(
	input: unknown,
): ContactSyncHistoryItem {
	return withDateFields<ContactSyncHistoryItem>(input, [
		"started_at",
		"completed_at",
	]);
}

export function parseContactSyncHistoryResponse(
	input: unknown,
): ContactSyncHistoryResponse {
	const output = cloneObject<ContactSyncHistoryResponse>(input);
	const typedInput =
		typeof input === "object" && input
			? (input as { history?: unknown })
			: undefined;
	output.history = mapArray(typedInput?.history, parseContactSyncHistoryItem);
	return output;
}

export function parseContactSyncResponse(input: unknown): ContactSyncResponse {
	return cloneObject<ContactSyncResponse>(input);
}

export function parseContactSyncStatusResponse(
	input: unknown,
): ContactSyncStatusResponse {
	return withDateFields<ContactSyncStatusResponse>(input, ["last_sync_at"]);
}

export function parseContactSyncStatusResponseList(
	input: unknown,
): ContactSyncStatusResponse[] {
	return mapArray(input, parseContactSyncStatusResponse);
}

export function parseContactProfilePictureResponse(
	input: unknown,
): ContactProfilePictureResponse {
	return cloneObject<ContactProfilePictureResponse>(input);
}

export function parseContactProfilePictureImageResult(
	input: unknown,
): ContactProfilePictureImageResult {
	const output = cloneObject<ContactProfilePictureImageResult>(input);
	if (output.content && !Buffer.isBuffer(output.content)) {
		output.content = Buffer.from(output.content as Uint8Array);
	}
	return output;
}
