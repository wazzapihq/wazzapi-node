import type { WazzapiClient } from "../client";

export class BaseResource {
	protected readonly _client: WazzapiClient;

	constructor(client: WazzapiClient) {
		this._client = client;
	}
}
