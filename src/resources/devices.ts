import * as models from "../models";
import { BaseResource } from "./base";

export class DevicesResource extends BaseResource {
	async list(options?: {
		limit?: number;
		offset?: number;
		status?: string;
		search?: string;
		sort_by?: string;
		sort_order?: string;
	}): Promise<models.DeviceListResponse> {
		return this._client._request("GET", "/api/v1/devices", {
			params: options,
			responseParser: models.parseDeviceListResponse,
		});
	}

	async get(deviceId: string): Promise<models.DeviceResponse> {
		return this._client._request("GET", `/api/v1/devices/${deviceId}`, {
			responseParser: models.parseDeviceResponse,
		});
	}

	async link(payload: Record<string, unknown>): Promise<Record<string, unknown>> {
		return this._client._request("POST", "/api/v1/devices", {
			jsonBody: payload,
		});
	}

	async getQr(deviceId: string): Promise<Record<string, unknown>> {
		return this._client._request("GET", `/api/v1/devices/${deviceId}/qr`);
	}

	async get_qr(deviceId: string): Promise<Record<string, unknown>> {
		return this.getQr(deviceId);
	}

	async getStatus(deviceId: string): Promise<Record<string, unknown>> {
		return this._client._request("GET", `/api/v1/devices/${deviceId}/status`);
	}

	async get_status(deviceId: string): Promise<Record<string, unknown>> {
		return this.getStatus(deviceId);
	}

	async disconnect(deviceId: string): Promise<Record<string, unknown>> {
		return this._client._request(
			"POST",
			`/api/v1/devices/${deviceId}/disconnect`,
		);
	}

	async reconnect(deviceId: string): Promise<Record<string, unknown>> {
		return this._client._request(
			"POST",
			`/api/v1/devices/${deviceId}/reconnect`,
		);
	}

	async getProxy(deviceId: string): Promise<Record<string, unknown>> {
		return this._client._request("GET", `/api/v1/devices/${deviceId}/proxy`);
	}

	async get_proxy(deviceId: string): Promise<Record<string, unknown>> {
		return this.getProxy(deviceId);
	}

	async updateProxy(
		deviceId: string,
		payload: Record<string, unknown>,
	): Promise<Record<string, unknown>> {
		return this._client._request("PATCH", `/api/v1/devices/${deviceId}/proxy`, {
			jsonBody: payload,
		});
	}

	async update_proxy(
		deviceId: string,
		payload: Record<string, unknown>,
	): Promise<Record<string, unknown>> {
		return this.updateProxy(deviceId, payload);
	}

	async testProxy(
		payload: Record<string, unknown>,
	): Promise<Record<string, unknown>> {
		return this._client._request("POST", "/api/v1/devices/proxy/test", {
			jsonBody: payload,
		});
	}

	async test_proxy(
		payload: Record<string, unknown>,
	): Promise<Record<string, unknown>> {
		return this.testProxy(payload);
	}
}
