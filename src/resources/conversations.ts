import * as models from "../models";
import { BaseResource } from "./base";

export class ConversationsResource extends BaseResource {
	async list(options?: {
		limit?: number;
		offset?: number;
		status?: string;
		whatsapp_account_id?: string;
		assignee_user_id?: string;
		search?: string;
	}): Promise<models.ConversationListResponse> {
		return this._client._request("GET", "/api/v1/conversations", {
			params: options,
			responseParser: models.parseConversationListResponse,
		});
	}

	async get(conversationId: string): Promise<models.ConversationItem> {
		return this._client._request(
			"GET",
			`/api/v1/conversations/${conversationId}`,
			{ responseParser: models.parseConversationItem },
		);
	}

	async update(
		conversationId: string,
		payload: models.ConversationUpdateRequest,
	): Promise<models.ConversationItem> {
		return this._client._request(
			"PATCH",
			`/api/v1/conversations/${conversationId}`,
			{
				jsonBody: payload,
				responseParser: models.parseConversationItem,
			},
		);
	}

	async listMessages(
		conversationId: string,
		options?: { limit?: number; offset?: number },
	): Promise<models.ConversationMessageListResponse> {
		return this._client._request(
			"GET",
			`/api/v1/conversations/${conversationId}/messages`,
			{
				params: options,
				responseParser: models.parseConversationMessageListResponse,
			},
		);
	}

	async list_messages(
		conversationId: string,
		options?: { limit?: number; offset?: number },
	): Promise<models.ConversationMessageListResponse> {
		return this.listMessages(conversationId, options);
	}

	async reply(
		conversationId: string,
		payload: models.ConversationReplyRequest,
	): Promise<models.ConversationReplyResponse> {
		return this._client._request(
			"POST",
			`/api/v1/conversations/${conversationId}/reply`,
			{
				jsonBody: payload,
				responseParser: models.parseConversationReplyResponse,
			},
		);
	}
}
