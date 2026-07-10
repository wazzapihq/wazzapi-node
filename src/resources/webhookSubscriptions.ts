import * as models from "../models";
import { BaseResource } from "./base";

type JsonObject = Record<string, unknown>;

export class WebhookSubscriptionsResource extends BaseResource {
	async list(options?: {
		limit?: number;
		offset?: number;
		active_only?: boolean;
	}): Promise<JsonObject> {
		return this._client._request("GET", "/api/v1/webhooks/subscriptions", {
			params: options,
		});
	}

	async create(payload: JsonObject): Promise<JsonObject> {
		return this._client._request("POST", "/api/v1/webhooks/subscriptions", {
			jsonBody: payload,
		});
	}

	async get(webhookId: string): Promise<JsonObject> {
		return this._client._request(
			"GET",
			`/api/v1/webhooks/subscriptions/${webhookId}`,
		);
	}

	async update(webhookId: string, payload: JsonObject): Promise<JsonObject> {
		return this._client._request(
			"PATCH",
			`/api/v1/webhooks/subscriptions/${webhookId}`,
			{ jsonBody: payload },
		);
	}

	async delete(webhookId: string): Promise<void> {
		await this._client._request(
			"DELETE",
			`/api/v1/webhooks/subscriptions/${webhookId}`,
		);
	}

	async listEvents(
		webhookId: string,
		options?: { limit?: number; offset?: number },
	): Promise<JsonObject> {
		return this._client._request(
			"GET",
			`/api/v1/webhooks/subscriptions/${webhookId}/events`,
			{ params: options },
		);
	}

	async list_events(
		webhookId: string,
		options?: { limit?: number; offset?: number },
	): Promise<JsonObject> {
		return this.listEvents(webhookId, options);
	}

	async ping(webhookId: string): Promise<JsonObject> {
		return this._client._request(
			"POST",
			`/api/v1/webhooks/subscriptions/${webhookId}/ping`,
		);
	}
}
