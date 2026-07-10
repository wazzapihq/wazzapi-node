import * as models from "../models";
import { BaseResource } from "./base";

export class CampaignsResource extends BaseResource {
	async list(options?: {
		limit?: number;
		offset?: number;
		status?: string;
	}): Promise<models.CampaignListResponse> {
		return this._client._request("GET", "/api/v1/campaigns", {
			params: options,
			responseParser: models.parseCampaignListResponse,
		});
	}

	async create(
		payload: models.CampaignCreateRequest,
	): Promise<models.CampaignResponse> {
		return this._client._request("POST", "/api/v1/campaigns", {
			jsonBody: payload,
			responseParser: models.parseCampaignResponse,
		});
	}

	async get(campaignId: string): Promise<models.CampaignResponse> {
		return this._client._request("GET", `/api/v1/campaigns/${campaignId}`, {
			responseParser: models.parseCampaignResponse,
		});
	}

	async update(
		campaignId: string,
		payload: models.CampaignUpdateRequest,
	): Promise<models.CampaignResponse> {
		return this._client._request("PATCH", `/api/v1/campaigns/${campaignId}`, {
			jsonBody: payload,
			responseParser: models.parseCampaignResponse,
		});
	}

	async delete(campaignId: string): Promise<void> {
		await this._client._request("DELETE", `/api/v1/campaigns/${campaignId}`);
	}

	async execute(campaignId: string): Promise<models.CampaignExecuteResponse> {
		return this._client._request(
			"POST",
			`/api/v1/campaigns/${campaignId}/execute`,
			{ responseParser: models.parseCampaignExecuteResponse },
		);
	}

	async pause(campaignId: string): Promise<models.CampaignActionResponse> {
		return this._client._request(
			"POST",
			`/api/v1/campaigns/${campaignId}/pause`,
			{ responseParser: models.parseCampaignActionResponse },
		);
	}

	async resume(campaignId: string): Promise<models.CampaignActionResponse> {
		return this._client._request(
			"POST",
			`/api/v1/campaigns/${campaignId}/resume`,
			{ responseParser: models.parseCampaignActionResponse },
		);
	}

	async cancel(campaignId: string): Promise<models.CampaignActionResponse> {
		return this._client._request(
			"POST",
			`/api/v1/campaigns/${campaignId}/cancel`,
			{ responseParser: models.parseCampaignActionResponse },
		);
	}
}
