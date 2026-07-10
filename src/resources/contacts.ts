import * as models from "../models";
import { BaseResource } from "./base";

type JsonObject = Record<string, unknown>;

export class ContactsResource extends BaseResource {
	async list(options?: {
		limit?: number;
		offset?: number;
		search?: string;
		source?: string;
		group_id?: string;
		sort_by?: string;
		sort_order?: string;
	}): Promise<models.ContactListResponse> {
		return this._client._request("GET", "/api/v1/contacts", {
			params: options,
			responseParser: models.parseContactListResponse,
		});
	}

	async create(
		payload: models.ContactCreateRequest,
	): Promise<models.ContactResponse> {
		return this._client._request("POST", "/api/v1/contacts", {
			jsonBody: payload,
			responseParser: models.parseContactResponse,
		});
	}

	async bulkDelete(
		payload: models.BulkDeleteRequest,
	): Promise<models.BulkDeleteResponse> {
		return this._client._request("POST", "/api/v1/contacts/bulk-delete", {
			jsonBody: payload,
			responseParser: models.parseBulkDeleteResponse,
		});
	}

	async bulk_delete(
		payload: models.BulkDeleteRequest,
	): Promise<models.BulkDeleteResponse> {
		return this.bulkDelete(payload);
	}

	async listGroups(options?: {
		limit?: number;
		offset?: number;
	}): Promise<models.ContactGroupListResponse> {
		return this._client._request("GET", "/api/v1/contacts/groups", {
			params: options,
			responseParser: models.parseContactGroupListResponse,
		});
	}

	async list_groups(options?: {
		limit?: number;
		offset?: number;
	}): Promise<models.ContactGroupListResponse> {
		return this.listGroups(options);
	}

	async createGroup(
		payload: models.ContactGroupCreateRequest,
	): Promise<models.ContactGroupItem> {
		return this._client._request("POST", "/api/v1/contacts/groups", {
			jsonBody: payload,
			responseParser: models.parseContactGroupItem,
		});
	}

	async create_group(
		payload: models.ContactGroupCreateRequest,
	): Promise<models.ContactGroupItem> {
		return this.createGroup(payload);
	}

	async getGroup(
		groupId: string,
		options?: { limit?: number; offset?: number },
	): Promise<models.ContactGroupMembersResponse> {
		return this._client._request("GET", `/api/v1/contacts/groups/${groupId}`, {
			params: options,
			responseParser: models.parseContactGroupMembersResponse,
		});
	}

	async get_group(
		groupId: string,
		options?: { limit?: number; offset?: number },
	): Promise<models.ContactGroupMembersResponse> {
		return this.getGroup(groupId, options);
	}

	async updateGroup(
		groupId: string,
		payload: models.ContactGroupUpdateRequest,
	): Promise<models.ContactGroupItem> {
		return this._client._request(
			"PATCH",
			`/api/v1/contacts/groups/${groupId}`,
			{
				jsonBody: payload,
				responseParser: models.parseContactGroupItem,
			},
		);
	}

	async update_group(
		groupId: string,
		payload: models.ContactGroupUpdateRequest,
	): Promise<models.ContactGroupItem> {
		return this.updateGroup(groupId, payload);
	}

	async deleteGroup(groupId: string): Promise<void> {
		await this._client._request("DELETE", `/api/v1/contacts/groups/${groupId}`);
	}

	async delete_group(groupId: string): Promise<void> {
		return this.deleteGroup(groupId);
	}

	async addToGroup(
		groupId: string,
		payload: models.AddToGroupRequest,
	): Promise<models.AddToGroupResponse> {
		return this._client._request(
			"POST",
			`/api/v1/contacts/groups/${groupId}/members`,
			{
				jsonBody: payload,
				responseParser: models.parseAddToGroupResponse,
			},
		);
	}

	async add_to_group(
		groupId: string,
		payload: models.AddToGroupRequest,
	): Promise<models.AddToGroupResponse> {
		return this.addToGroup(groupId, payload);
	}

	async removeFromGroup(
		groupId: string,
		payload: models.RemoveFromGroupRequest,
	): Promise<models.AddToGroupResponse> {
		return this._client._request(
			"DELETE",
			`/api/v1/contacts/groups/${groupId}/members`,
			{
				jsonBody: payload,
				responseParser: models.parseAddToGroupResponse,
			},
		);
	}

	async remove_from_group(
		groupId: string,
		payload: models.RemoveFromGroupRequest,
	): Promise<models.AddToGroupResponse> {
		return this.removeFromGroup(groupId, payload);
	}

	async importCsv(
		payload: models.CSVImportRequest,
	): Promise<models.CSVImportResponse> {
		return this._client._request("POST", "/api/v1/contacts/import/csv", {
			jsonBody: payload,
			responseParser: models.parseCSVImportResponse,
		});
	}

	async import_csv(
		payload: models.CSVImportRequest,
	): Promise<models.CSVImportResponse> {
		return this.importCsv(payload);
	}

	async exportCsv(options?: {
		group_id?: string;
		source?: string;
	}): Promise<models.CSVExportResponse> {
		return this._client._request("GET", "/api/v1/contacts/export/csv", {
			params: options,
			responseParser: models.parseCSVExportResponse,
		});
	}

	async export_csv(options?: {
		group_id?: string;
		source?: string;
	}): Promise<models.CSVExportResponse> {
		return this.exportCsv(options);
	}

	async sync(
		payload: models.ContactSyncRequest,
	): Promise<models.ContactSyncResponse> {
		return this._client._request("POST", "/api/v1/contacts/sync", {
			jsonBody: payload,
			responseParser: models.parseContactSyncResponse,
		});
	}

	async syncStatus(): Promise<models.ContactSyncStatusResponse[]> {
		return this._client._request("GET", "/api/v1/contacts/sync/status", {
			responseParser: models.parseContactSyncStatusResponseList,
		});
	}

	async sync_status(): Promise<models.ContactSyncStatusResponse[]> {
		return this.syncStatus();
	}

	async syncHistory(options?: {
		limit?: number;
		offset?: number;
	}): Promise<models.ContactSyncHistoryResponse> {
		return this._client._request("GET", "/api/v1/contacts/sync/history", {
			params: options,
			responseParser: models.parseContactSyncHistoryResponse,
		});
	}

	async sync_history(options?: {
		limit?: number;
		offset?: number;
	}): Promise<models.ContactSyncHistoryResponse> {
		return this.syncHistory(options);
	}

	async importTemplate(): Promise<JsonObject> {
		return this._client._request<JsonObject>(
			"GET",
			"/api/v1/contacts/import/template",
		);
	}

	async import_template(): Promise<JsonObject> {
		return this.importTemplate();
	}

	async get(contactId: string): Promise<models.ContactResponse> {
		return this._client._request("GET", `/api/v1/contacts/${contactId}`, {
			responseParser: models.parseContactResponse,
		});
	}

	async update(
		contactId: string,
		payload: models.ContactUpdateRequest,
	): Promise<models.ContactResponse> {
		return this._client._request("PATCH", `/api/v1/contacts/${contactId}`, {
			jsonBody: payload,
			responseParser: models.parseContactResponse,
		});
	}

	async delete(contactId: string): Promise<void> {
		await this._client._request("DELETE", `/api/v1/contacts/${contactId}`);
	}

	async getProfilePicture(
		contactId: string,
		options?: {
			whatsapp_account_id?: string;
			preview?: boolean;
		},
	): Promise<models.ContactProfilePictureResponse> {
		return this._client._request(
			"GET",
			`/api/v1/contacts/${contactId}/profile-picture`,
			{
				params: options,
				responseParser: models.parseContactProfilePictureResponse,
			},
		);
	}

	async get_profile_picture(
		contactId: string,
		options?: {
			whatsapp_account_id?: string;
			preview?: boolean;
		},
	): Promise<models.ContactProfilePictureResponse> {
		return this.getProfilePicture(contactId, options);
	}

	async getProfilePictureImage(
		contactId: string,
		options?: {
			whatsapp_account_id?: string;
			preview?: boolean;
			proxy?: boolean;
		},
	): Promise<models.ContactProfilePictureImageResult> {
		return this._client._requestBytes(
			"GET",
			`/api/v1/contacts/${contactId}/profile-picture/image`,
			{
				params: options,
				responseParser: models.parseContactProfilePictureImageResult,
			},
		);
	}

	async get_profile_picture_image(
		contactId: string,
		options?: {
			whatsapp_account_id?: string;
			preview?: boolean;
			proxy?: boolean;
		},
	): Promise<models.ContactProfilePictureImageResult> {
		return this.getProfilePictureImage(contactId, options);
	}
}
