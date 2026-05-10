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

describe("groups resource", () => {
	test("list sends query params", async () => {
		let seenSearch = "";
		const client = new WazzapiClient({
			baseUrl: "https://api.example.com",
			fetch: async (input: RequestInput): Promise<Response> => {
				const url = new URL(resolveRequestUrl(input));
				seenSearch = url.search;
				return new Response(JSON.stringify({ groups: [], total: 0 }), {
					status: 200,
					headers: { "content-type": "application/json" },
				});
			},
		});

		await client.groups.list({ session_name: "main", limit: 10, offset: 5 });
		expect(seenSearch).toBe("?session_name=main&limit=10&offset=5");
	});

	test("remove photo returns operation response", async () => {
		const seen: { method?: string; path?: string; search?: string } = {};
		const client = new WazzapiClient({
			baseUrl: "https://api.example.com",
			fetch: async (
				input: RequestInput,
				init?: RequestInit,
			): Promise<Response> => {
				const url = new URL(resolveRequestUrl(input));
				seen.method = init?.method;
				seen.path = url.pathname;
				seen.search = url.search;
				return new Response(
					JSON.stringify({ success: true, details: "photo removed" }),
					{
						status: 200,
						headers: { "content-type": "application/json" },
					},
				);
			},
		});

		const result = await client.groups.remove_photo("123@g.us", {
			session_name: "main",
		});

		expect(seen.method).toBe("DELETE");
		expect(seen.path).toBe("/api/v1/groups/123@g.us/photo");
		expect(seen.search).toBe("?session_name=main");
		expect(result.success).toBe(true);
	});

	test("snake case helper aliases work", async () => {
		let seenPath = "";
		const client = new WazzapiClient({
			baseUrl: "https://api.example.com",
			fetch: async (input: RequestInput): Promise<Response> => {
				const url = new URL(resolveRequestUrl(input));
				seenPath = url.pathname;
				return new Response(
					JSON.stringify({ success: true, details: "done" }),
					{
						status: 200,
						headers: { "content-type": "application/json" },
					},
				);
			},
		});

		await client.groups.set_topic("123@g.us", {
			session_name: "main",
			topic: "new topic",
		});
		expect(seenPath).toBe("/api/v1/groups/123@g.us/topic");
	});
});
