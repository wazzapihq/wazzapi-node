import { WazzapiAPIError } from "./errors";
import { filterNone, type JsonRecord, serializeData } from "./models/base";
import {
	ContactsResource,
	DevicesResource,
	GroupsResource,
	MessagesResource,
	TemplatesResource,
} from "./resources";

export const DEFAULT_BASE_URL = "https://api.wazzapi.com";

export type FetchLike = (
	input: string | URL | Request,
	init?: RequestInit,
) => Promise<Response>;

export interface WazzapiClientOptions {
	baseUrl?: string;
	apiKey?: string;
	timeout?: number;
	headers?: Record<string, string>;
	fetch?: FetchLike;
}

export interface RequestOptions<T> {
	params?: JsonRecord;
	jsonBody?: JsonRecord;
	responseParser?: (payload: unknown) => T;
}

export interface WazzapiHttpConfig {
	readonly baseUrl: string;
	readonly headers: Record<string, string>;
	readonly timeout: number;
	readonly fetch: FetchLike;
}

function buildHeaders(
	apiKey?: string,
	headers?: Record<string, string>,
): Record<string, string> {
	const merged: Record<string, string> = {
		Accept: "application/json",
		"Content-Type": "application/json",
	};

	if (headers) {
		Object.entries(headers).forEach(([key, value]) => {
			merged[key] = value;
		});
	}

	if (apiKey) {
		merged.Authorization = apiKey.toLowerCase().startsWith("bearer ")
			? apiKey
			: `Bearer ${apiKey}`;
	}

	return merged;
}

function parseJson(text: string): unknown {
	if (!text) {
		return undefined;
	}

	return JSON.parse(text);
}

function normalizeBaseUrl(baseUrl: string): string {
	return baseUrl.replace(/\/+$/, "");
}

export class WazzapiClient {
	readonly http: WazzapiHttpConfig;
	readonly contacts: ContactsResource;
	readonly devices: DevicesResource;
	readonly groups: GroupsResource;
	readonly messages: MessagesResource;
	readonly templates: TemplatesResource;

	constructor(options: WazzapiClientOptions = {}) {
		const baseUrl = options.baseUrl ?? DEFAULT_BASE_URL;
		const timeout = options.timeout ?? 30000;
		const fetcher = options.fetch ?? fetch;

		this.http = {
			baseUrl: normalizeBaseUrl(baseUrl),
			headers: buildHeaders(options.apiKey, options.headers),
			timeout,
			fetch: fetcher,
		};

		this.contacts = new ContactsResource(this);
		this.devices = new DevicesResource(this);
		this.groups = new GroupsResource(this);
		this.messages = new MessagesResource(this);
		this.templates = new TemplatesResource(this);
	}

	get base_url(): string {
		return this.http.baseUrl;
	}

	async close(): Promise<void> {
		return;
	}

	async _request<T = unknown>(
		method: string,
		path: string,
		options: RequestOptions<T> = {},
	): Promise<T> {
		const url = new URL(path, `${this.http.baseUrl}/`);
		const params = filterNone(options.params);

		if (params) {
			Object.entries(params).forEach(([key, value]) => {
				url.searchParams.set(key, String(value));
			});
		}

		const body = options.jsonBody
			? JSON.stringify(serializeData(options.jsonBody))
			: undefined;
		const controller = new AbortController();
		const timeoutId = setTimeout(() => {
			controller.abort();
		}, this.http.timeout);

		try {
			const response = await this.http.fetch(url.toString(), {
				method,
				headers: this.http.headers,
				body,
				signal: controller.signal,
			});

			const responseText = await response.text();
			const payload =
				responseText.length > 0 ? parseJson(responseText) : undefined;

			if (response.status >= 400) {
				throw WazzapiAPIError.fromResponseParts(
					response.status,
					response.statusText,
					responseText,
					payload,
				);
			}

			if (response.status === 204 || responseText.length === 0) {
				return undefined as T;
			}

			if (options.responseParser) {
				return options.responseParser(payload);
			}

			return (payload ?? responseText) as T;
		} finally {
			clearTimeout(timeoutId);
		}
	}
}
