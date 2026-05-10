import { cloneObject, mapArray, type WazzapiModel, withDateFields } from "./base";

export interface DeviceItem extends WazzapiModel {
	id: string;
	name: string;
	session_name: string;
	status: string;
	is_primary: boolean;
	auto_warmer_enabled: boolean;
	total_messages_sent: number;
	total_messages_received: number;
	contacts_synced_count: number;
	created_at: Date;
	updated_at: Date;
	phone_number?: string | null;
	last_connected_at?: Date | null;
	last_health_check_at?: Date | null;
	last_contact_sync_at?: Date | null;
	last_contact_sync_status?: string | null;
}

export interface DeviceListResponse extends WazzapiModel {
	devices: DeviceItem[];
	total: number;
	limit: number;
	offset: number;
}

export interface DeviceResponse extends DeviceItem {
	timezone: string;
	connection_attempts: number;
	daily_message_limit: number;
	message_delay_ms: number;
	backend_id?: string | null;
}

export function parseDeviceItem(input: unknown): DeviceItem {
	return withDateFields<DeviceItem>(input, [
		"created_at",
		"updated_at",
		"last_connected_at",
		"last_health_check_at",
		"last_contact_sync_at",
	]);
}

export function parseDeviceListResponse(input: unknown): DeviceListResponse {
	const output = cloneObject<DeviceListResponse>(input);
	const typedInput =
		typeof input === "object" && input
			? (input as { devices?: unknown })
			: undefined;
	output.devices = mapArray(typedInput?.devices, parseDeviceItem);
	return output;
}

export function parseDeviceResponse(input: unknown): DeviceResponse {
	return withDateFields<DeviceResponse>(input, [
		"created_at",
		"updated_at",
		"last_connected_at",
		"last_health_check_at",
		"last_contact_sync_at",
	]);
}
