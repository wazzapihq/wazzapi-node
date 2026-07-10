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

function createMockClient(
	handler: (url: URL, init?: RequestInit) => Response | Promise<Response>,
): WazzapiClient {
	return new WazzapiClient({
		baseUrl: "https://api.example.com",
		fetch: async (
			input: RequestInput,
			init?: RequestInit,
		): Promise<Response> => {
			const url = new URL(resolveRequestUrl(input));
			return handler(url, init);
		},
	});
}

describe("resource routes", () => {
	test("contacts create hits expected route", async () => {
		const seen: { method?: string; path?: string } = {};
		const client = createMockClient((url, init) => {
			seen.method = init?.method;
			seen.path = url.pathname;
			return new Response(
				JSON.stringify({
					id: "contact_1",
					phone_number: "+6281234567890",
					source: "manual",
					is_opted_out: false,
					tags: [],
					created_at: "2026-05-01T00:00:00Z",
					updated_at: "2026-05-01T00:00:00Z",
				}),
				{ status: 201, headers: { "content-type": "application/json" } },
			);
		});

		const result = await client.contacts.create({
			phone_number: "+6281234567890",
		});

		expect(seen.method).toBe("POST");
		expect(seen.path).toBe("/api/v1/contacts");
		expect(result.id).toBe("contact_1");
		expect(result.created_at instanceof Date).toBe(true);
	});

	test("messages stats hits expected route", async () => {
		const seen: { method?: string; path?: string } = {};
		const client = createMockClient((url, init) => {
			seen.method = init?.method;
			seen.path = url.pathname;
			return new Response(
				JSON.stringify({
					total: 10,
					by_status: { queued: 5, sent: 5 },
					by_direction: { outbound: 10 },
					last_7_days: 10,
					last_30_days: 10,
				}),
				{ status: 200, headers: { "content-type": "application/json" } },
			);
		});

		const result = await client.messages.stats();

		expect(seen.method).toBe("GET");
		expect(seen.path).toBe("/api/v1/messages/stats/summary");
		expect(result.total).toBe(10);
	});

	test("template delete returns void", async () => {
		let seenPath = "";
		const client = createMockClient((url) => {
			seenPath = url.pathname;
			return new Response(undefined, { status: 204 });
		});

		const result = await client.templates.delete("template_1");

		expect(result).toBeUndefined();
		expect(seenPath).toBe("/api/v1/templates/template_1");
	});

	test("sync status returns typed list", async () => {
		const client = createMockClient(
			() =>
				new Response(
					JSON.stringify([
						{
							account_id: "wa_123",
							account_name: "Primary Device",
							last_sync_at: "2026-05-01T00:00:00Z",
							last_sync_status: "completed",
							contacts_synced_count: 42,
							can_sync: true,
						},
					]),
					{ status: 200, headers: { "content-type": "application/json" } },
				),
		);

		const result = await client.contacts.sync_status();

		expect(result).toHaveLength(1);
		expect(result[0].account_id).toBe("wa_123");
		expect(result[0].last_sync_at instanceof Date).toBe(true);
	});

	test("get profile picture returns metadata", async () => {
		const seen: { method?: string; path?: string; search?: string } = {};
		const client = createMockClient((url, init) => {
			seen.method = init?.method;
			seen.path = url.pathname;
			seen.search = url.search;
			return new Response(
				JSON.stringify({
					contact_id: "contact_1",
					phone_number: "+6281234567890",
					url: "https://cdn.example.com/pic.jpg",
					picture_id: "pic_1",
					picture_type: "image",
					preview: true,
					whatsapp_account_id: "wa_1",
					cached: false,
				}),
				{ status: 200, headers: { "content-type": "application/json" } },
			);
		});

		const result = await client.contacts.getProfilePicture("contact_1", {
			whatsapp_account_id: "wa_1",
			preview: true,
		});

		expect(seen.method).toBe("GET");
		expect(seen.path).toBe("/api/v1/contacts/contact_1/profile-picture");
		expect(seen.search).toContain("whatsapp_account_id=wa_1");
		expect(result.url).toBe("https://cdn.example.com/pic.jpg");
		expect(result.preview).toBe(true);
	});

	test("get profile picture image returns bytes", async () => {
		const seen: { method?: string; path?: string; search?: string } = {};
		const imageBytes = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 1, 2, 3]);
		const client = createMockClient((url, init) => {
			seen.method = init?.method;
			seen.path = url.pathname;
			seen.search = url.search;
			return new Response(imageBytes, {
				status: 200,
				headers: { "content-type": "image/jpeg" },
			});
		});

		const result = await client.contacts.getProfilePictureImage("contact_1", {
			proxy: true,
			preview: false,
		});

		expect(seen.method).toBe("GET");
		expect(seen.path).toBe("/api/v1/contacts/contact_1/profile-picture/image");
		expect(seen.search).toContain("proxy=true");
		expect(Buffer.isBuffer(result.content)).toBe(true);
		expect(result.content.equals(Buffer.from(imageBytes))).toBe(true);
		expect(result.content_type).toBe("image/jpeg");
	});

});
