import { describe, expect, test } from "bun:test";

import { WazzapiClient } from "../src";

type RequestInput = string | URL | Request;

function resolveRequestUrl(input: RequestInput): string {
	if (typeof input === "string") {
		return input;
	}
	if (input instanceof URL) {
		return input.toString();
	}

	return input.url;
}

describe("devices", () => {
	test("list devices sends supported query params and parses dates", async () => {
		let seenSearch = "";
		const client = new WazzapiClient({
			baseUrl: "https://api.example.com",
			fetch: async (input: RequestInput): Promise<Response> => {
				const url = new URL(resolveRequestUrl(input));
				seenSearch = url.search;
				return new Response(
					JSON.stringify({
						devices: [
							{
								id: "3c90c3cc-0d44-4b50-8888-8dd25736052a",
								name: "Primary Device",
								session_name: "primary",
								status: "connected",
								is_primary: true,
								auto_warmer_enabled: true,
								total_messages_sent: 123,
								total_messages_received: 45,
								contacts_synced_count: 678,
								created_at: "2026-05-01T00:00:00Z",
								updated_at: "2026-05-02T00:00:00Z",
								phone_number: "6281234567890",
								last_connected_at: "2026-05-03T00:00:00Z",
								last_health_check_at: "2026-05-03T01:00:00Z",
								last_contact_sync_at: "2026-05-03T02:00:00Z",
								last_contact_sync_status: "completed",
							},
						],
						total: 1,
						limit: 10,
						offset: 5,
					}),
					{
						status: 200,
						headers: { "content-type": "application/json" },
					},
				);
			},
		});

		const result = await client.devices.list({
			limit: 10,
			offset: 5,
			status: "connected",
			search: "primary",
			sort_by: "created_at",
			sort_order: "desc",
		});

		expect(seenSearch).toBe(
			"?limit=10&offset=5&status=connected&search=primary&sort_by=created_at&sort_order=desc",
		);
		expect(result.devices).toHaveLength(1);
		expect(result.devices[0].created_at instanceof Date).toBe(true);
		expect(result.devices[0].last_contact_sync_at instanceof Date).toBe(true);
	});

	test("get device hits expected route and returns typed device", async () => {
		const seen: { method?: string; path?: string } = {};
		const client = new WazzapiClient({
			baseUrl: "https://api.example.com",
			fetch: async (
				input: RequestInput,
				init?: RequestInit,
			): Promise<Response> => {
				const url = new URL(resolveRequestUrl(input));
				seen.method = init?.method;
				seen.path = url.pathname;
				return new Response(
					JSON.stringify({
						id: "3c90c3cc-0d44-4b50-8888-8dd25736052a",
						name: "Primary Device",
						session_name: "primary",
						status: "connected",
						is_primary: true,
						auto_warmer_enabled: true,
						total_messages_sent: 123,
						total_messages_received: 45,
						contacts_synced_count: 678,
						created_at: "2026-05-01T00:00:00Z",
						updated_at: "2026-05-02T00:00:00Z",
						timezone: "Asia/Jakarta",
						connection_attempts: 2,
						daily_message_limit: 500,
						message_delay_ms: 1500,
						phone_number: "6281234567890",
						last_connected_at: "2026-05-03T00:00:00Z",
						last_health_check_at: "2026-05-03T01:00:00Z",
						last_contact_sync_at: "2026-05-03T02:00:00Z",
						last_contact_sync_status: "completed",
						backend_id: "31fcb283-ccf2-429d-bd71-7865ab913ca1",
					}),
					{
						status: 200,
						headers: { "content-type": "application/json" },
					},
				);
			},
		});

		const result = await client.devices.get(
			"3c90c3cc-0d44-4b50-8888-8dd25736052a",
		);

		expect(seen.method).toBe("GET");
		expect(seen.path).toBe(
			"/api/v1/devices/3c90c3cc-0d44-4b50-8888-8dd25736052a",
		);
		expect(result.timezone).toBe("Asia/Jakarta");
		expect(result.created_at instanceof Date).toBe(true);
		expect(result.backend_id).toBe("31fcb283-ccf2-429d-bd71-7865ab913ca1");
	});
});
