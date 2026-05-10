import * as models from "../models";
import { BaseResource } from "./base";

export class TemplatesResource extends BaseResource {
	async builtinVariables(): Promise<models.BuiltinVariablesResponse> {
		return this._client._request("GET", "/api/v1/templates/builtin-variables", {
			responseParser: models.parseBuiltinVariablesResponse,
		});
	}

	async builtin_variables(): Promise<models.BuiltinVariablesResponse> {
		return this.builtinVariables();
	}

	async list(options?: {
		limit?: number;
		offset?: number;
		category?: string;
		search?: string;
		sort_by?: string;
		sort_order?: string;
	}): Promise<models.TemplateListResponse> {
		return this._client._request("GET", "/api/v1/templates", {
			params: options,
			responseParser: models.parseTemplateListResponse,
		});
	}

	async create(
		payload: models.TemplateCreateRequest,
	): Promise<models.TemplateResponse> {
		return this._client._request("POST", "/api/v1/templates", {
			jsonBody: payload,
			responseParser: models.parseTemplateResponse,
		});
	}

	async get(templateId: string): Promise<models.TemplateResponse> {
		return this._client._request("GET", `/api/v1/templates/${templateId}`, {
			responseParser: models.parseTemplateResponse,
		});
	}

	async update(
		templateId: string,
		payload: models.TemplateUpdateRequest,
	): Promise<models.TemplateResponse> {
		return this._client._request("PATCH", `/api/v1/templates/${templateId}`, {
			jsonBody: payload,
			responseParser: models.parseTemplateResponse,
		});
	}

	async delete(templateId: string): Promise<void> {
		await this._client._request("DELETE", `/api/v1/templates/${templateId}`);
	}

	async preview(
		payload: models.TemplatePreviewRequest,
	): Promise<models.TemplatePreviewResponse> {
		return this._client._request("POST", "/api/v1/templates/preview", {
			jsonBody: payload,
			responseParser: models.parseTemplatePreviewResponse,
		});
	}
}
