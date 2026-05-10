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
}
