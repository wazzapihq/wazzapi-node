import { describe, expect, test } from "bun:test";

import { WazzapiAPIError, WazzapiClient } from "../src";

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

function createJsonResponse(status: number, body?: unknown): Response {
	return new Response(body === undefined ? undefined : JSON.stringify(body), {
		status,
		headers: { "content-type": "application/json" },
	});
}

describe("client", () => {
	test("formats bearer auth header", () => {
		const client = new WazzapiClient({
			baseUrl: "https://api.example.com",
			apiKey: "plain-token",
		});

		expect(client.http.headers.Authorization).toBe("Bearer plain-token");
		expect(client.http.headers.Accept).toBe("application/json");
		expect(client.http.headers["Content-Type"]).toBe("application/json");
	});

	test("uses default base url", () => {
		const client = new WazzapiClient({ apiKey: "plain-token" });
		expect(client.http.baseUrl).toBe("https://api.wazzapi.com");
		expect(client.base_url).toBe("https://api.wazzapi.com");
	});

	test("preserves existing bearer prefix", () => {
		const client = new WazzapiClient({
			baseUrl: "https://api.example.com",
			apiKey: "Bearer already-set",
		});
		expect(client.http.headers.Authorization).toBe("Bearer already-set");
	});

	test("serializes models and filters null query params", async () => {
		const seen: { query?: string; body?: Record<string, unknown> } = {};
		const client = new WazzapiClient({
			baseUrl: "https://api.example.com",
			fetch: async (
				input: RequestInput,
				init?: RequestInit,
			): Promise<Response> => {
				const requestUrl = new URL(resolveRequestUrl(input));
				seen.query = requestUrl.search;
				seen.body =
					typeof init?.body === "string"
						? (JSON.parse(init.body) as Record<string, unknown>)
						: undefined;
				return createJsonResponse(201, {
					id: "contact_1",
					phone_number: "+6281234567890",
					source: "manual",
					is_opted_out: false,
					tags: [],
					created_at: "2026-05-01T00:00:00Z",
					updated_at: "2026-05-01T00:00:00Z",
				});
			},
		});

		const response = await client._request<{ id: string }>(
			"POST",
			"/api/v1/contacts",
			{
				params: { limit: 10, search: null },
				jsonBody: { phone_number: "+6281234567890", name: null },
			},
		);

		expect(seen.query).toBe("?limit=10");
		expect(seen.body).toEqual({ phone_number: "+6281234567890" });
		expect(response.id).toBe("contact_1");
	});

	test("raises api error with parsed detail message", async () => {
		const client = new WazzapiClient({
			baseUrl: "https://api.example.com",
			fetch: async (): Promise<Response> =>
				createJsonResponse(400, { detail: [{ msg: "Invalid input" }] }),
		});

		try {
			await client._request("GET", "/api/v1/test");
			throw new Error("expected request to fail");
		} catch (error) {
			expect(error instanceof WazzapiAPIError).toBe(true);
			expect((error as WazzapiAPIError).message).toBe("Invalid input");
			expect((error as WazzapiAPIError).statusCode).toBe(400);
		}
	});
});
