import * as models from "../models";
import { BaseResource } from "./base";

export class GroupsResource extends BaseResource {
	async list(options: {
		session_name: string;
		limit?: number;
		offset?: number;
	}): Promise<models.GroupListResponse> {
		return this._client._request("GET", "/api/v1/groups", {
			params: options,
			responseParser: models.parseGroupListResponse,
		});
	}

	async get(
		groupJid: string,
		options: { session_name: string },
	): Promise<models.GroupDetailResponse> {
		return this._client._request("GET", `/api/v1/groups/${groupJid}`, {
			params: options,
			responseParser: models.parseGroupDetailResponse,
		});
	}

	async getParticipants(
		groupJid: string,
		options: { session_name: string },
	): Promise<models.GroupParticipantsResponse> {
		return this._client._request(
			"GET",
			`/api/v1/groups/${groupJid}/participants`,
			{
				params: options,
				responseParser: models.parseGroupParticipantsResponse,
			},
		);
	}

	async get_participants(
		groupJid: string,
		options: { session_name: string },
	): Promise<models.GroupParticipantsResponse> {
		return this.getParticipants(groupJid, options);
	}

	async create(
		payload: models.CreateGroupRequest,
	): Promise<models.CreateGroupResponseModel> {
		return this._client._request("POST", "/api/v1/groups/create", {
			jsonBody: payload,
			responseParser: models.parseCreateGroupResponseModel,
		});
	}

	async sendText(
		payload: models.SendGroupTextRequest,
	): Promise<models.SendGroupResponse> {
		return this._client._request("POST", "/api/v1/groups/send", {
			jsonBody: payload,
			responseParser: models.parseSendGroupResponse,
		});
	}

	async send_text(
		payload: models.SendGroupTextRequest,
	): Promise<models.SendGroupResponse> {
		return this.sendText(payload);
	}

	async sendMedia(
		payload: models.SendGroupMediaRequest,
	): Promise<models.SendGroupResponse> {
		return this._client._request("POST", "/api/v1/groups/send/media", {
			jsonBody: payload,
			responseParser: models.parseSendGroupResponse,
		});
	}

	async send_media(
		payload: models.SendGroupMediaRequest,
	): Promise<models.SendGroupResponse> {
		return this.sendMedia(payload);
	}

	async updateParticipants(
		payload: models.UpdateParticipantsRequest,
	): Promise<models.GroupOperationResponseModel> {
		return this._client._request("POST", "/api/v1/groups/participants", {
			jsonBody: payload,
			responseParser: models.parseGroupOperationResponseModel,
		});
	}

	async update_participants(
		payload: models.UpdateParticipantsRequest,
	): Promise<models.GroupOperationResponseModel> {
		return this.updateParticipants(payload);
	}

	async addParticipant(
		groupJid: string,
		options: { session_name: string; participant_jid: string },
	): Promise<models.GroupOperationResponseModel> {
		return this._client._request(
			"POST",
			`/api/v1/groups/${groupJid}/participants/add`,
			{
				params: options,
				responseParser: models.parseGroupOperationResponseModel,
			},
		);
	}

	async add_participant(
		groupJid: string,
		options: { session_name: string; participant_jid: string },
	): Promise<models.GroupOperationResponseModel> {
		return this.addParticipant(groupJid, options);
	}

	async removeParticipant(
		groupJid: string,
		options: { session_name: string; participant_jid: string },
	): Promise<models.GroupOperationResponseModel> {
		return this._client._request(
			"POST",
			`/api/v1/groups/${groupJid}/participants/remove`,
			{
				params: options,
				responseParser: models.parseGroupOperationResponseModel,
			},
		);
	}

	async remove_participant(
		groupJid: string,
		options: { session_name: string; participant_jid: string },
	): Promise<models.GroupOperationResponseModel> {
		return this.removeParticipant(groupJid, options);
	}

	async getInviteLink(
		groupJid: string,
		options: { session_name: string },
	): Promise<models.GroupInviteLinkResponseModel> {
		return this._client._request(
			"POST",
			`/api/v1/groups/${groupJid}/invite-link`,
			{
				params: options,
				responseParser: models.parseGroupInviteLinkResponseModel,
			},
		);
	}

	async get_invite_link(
		groupJid: string,
		options: { session_name: string },
	): Promise<models.GroupInviteLinkResponseModel> {
		return this.getInviteLink(groupJid, options);
	}

	async getInviteInfo(
		payload: models.InviteInfoRequest,
	): Promise<models.GroupInviteInfoResponseModel> {
		return this._client._request("POST", "/api/v1/groups/invite-info", {
			jsonBody: payload,
			responseParser: models.parseGroupInviteInfoResponseModel,
		});
	}

	async get_invite_info(
		payload: models.InviteInfoRequest,
	): Promise<models.GroupInviteInfoResponseModel> {
		return this.getInviteInfo(payload);
	}

	async join(
		payload: models.JoinGroupRequest,
	): Promise<models.GroupOperationResponseModel> {
		return this._client._request("POST", "/api/v1/groups/join", {
			jsonBody: payload,
			responseParser: models.parseGroupOperationResponseModel,
		});
	}

	async leave(
		groupJid: string,
		options: { session_name: string },
	): Promise<models.GroupOperationResponseModel> {
		return this._client._request("POST", `/api/v1/groups/${groupJid}/leave`, {
			params: options,
			responseParser: models.parseGroupOperationResponseModel,
		});
	}

	async setName(
		groupJid: string,
		payload: models.SetGroupNameRequest,
	): Promise<models.GroupOperationResponseModel> {
		return this._client._request("POST", `/api/v1/groups/${groupJid}/name`, {
			jsonBody: payload,
			responseParser: models.parseGroupOperationResponseModel,
		});
	}

	async set_name(
		groupJid: string,
		payload: models.SetGroupNameRequest,
	): Promise<models.GroupOperationResponseModel> {
		return this.setName(groupJid, payload);
	}

	async setTopic(
		groupJid: string,
		payload: models.SetGroupTopicRequest,
	): Promise<models.GroupOperationResponseModel> {
		return this._client._request("POST", `/api/v1/groups/${groupJid}/topic`, {
			jsonBody: payload,
			responseParser: models.parseGroupOperationResponseModel,
		});
	}

	async set_topic(
		groupJid: string,
		payload: models.SetGroupTopicRequest,
	): Promise<models.GroupOperationResponseModel> {
		return this.setTopic(groupJid, payload);
	}

	async setPhoto(
		groupJid: string,
		payload: models.SetGroupPhotoRequest,
	): Promise<models.GroupOperationResponseModel> {
		return this._client._request("POST", `/api/v1/groups/${groupJid}/photo`, {
			jsonBody: payload,
			responseParser: models.parseGroupOperationResponseModel,
		});
	}

	async set_photo(
		groupJid: string,
		payload: models.SetGroupPhotoRequest,
	): Promise<models.GroupOperationResponseModel> {
		return this.setPhoto(groupJid, payload);
	}

	async removePhoto(
		groupJid: string,
		options: { session_name: string },
	): Promise<models.GroupOperationResponseModel> {
		return this._client._request("DELETE", `/api/v1/groups/${groupJid}/photo`, {
			params: options,
			responseParser: models.parseGroupOperationResponseModel,
		});
	}

	async remove_photo(
		groupJid: string,
		options: { session_name: string },
	): Promise<models.GroupOperationResponseModel> {
		return this.removePhoto(groupJid, options);
	}

	async setAnnounce(
		groupJid: string,
		payload: models.SetGroupAnnounceRequest,
	): Promise<models.GroupOperationResponseModel> {
		return this._client._request(
			"POST",
			`/api/v1/groups/${groupJid}/announce`,
			{
				jsonBody: payload,
				responseParser: models.parseGroupOperationResponseModel,
			},
		);
	}

	async set_announce(
		groupJid: string,
		payload: models.SetGroupAnnounceRequest,
	): Promise<models.GroupOperationResponseModel> {
		return this.setAnnounce(groupJid, payload);
	}

	async setLocked(
		groupJid: string,
		payload: models.SetGroupLockedRequest,
	): Promise<models.GroupOperationResponseModel> {
		return this._client._request("POST", `/api/v1/groups/${groupJid}/locked`, {
			jsonBody: payload,
			responseParser: models.parseGroupOperationResponseModel,
		});
	}

	async set_locked(
		groupJid: string,
		payload: models.SetGroupLockedRequest,
	): Promise<models.GroupOperationResponseModel> {
		return this.setLocked(groupJid, payload);
	}

	async setEphemeral(
		groupJid: string,
		payload: models.SetGroupEphemeralRequest,
	): Promise<models.GroupOperationResponseModel> {
		return this._client._request(
			"POST",
			`/api/v1/groups/${groupJid}/ephemeral`,
			{
				jsonBody: payload,
				responseParser: models.parseGroupOperationResponseModel,
			},
		);
	}

	async set_ephemeral(
		groupJid: string,
		payload: models.SetGroupEphemeralRequest,
	): Promise<models.GroupOperationResponseModel> {
		return this.setEphemeral(groupJid, payload);
	}
}
