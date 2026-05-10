import * as models from "../models";
import { BaseResource } from "./base";

export class MessagesResource extends BaseResource {
	async lookup(whatsappMessageId: string): Promise<models.MessageResponse> {
		return this._client._request("GET", "/api/v1/messages/lookup", {
			params: { whatsapp_message_id: whatsappMessageId },
			responseParser: models.parseMessageResponse,
		});
	}

	async list(options?: {
		limit?: number;
		offset?: number;
		status?: string;
		direction?: string;
		whatsapp_account_id?: string;
		search?: string;
		sort_by?: string;
		sort_order?: string;
	}): Promise<models.MessageListResponse> {
		return this._client._request("GET", "/api/v1/messages", {
			params: options,
			responseParser: models.parseMessageListResponse,
		});
	}

	async get(messageId: string): Promise<models.MessageResponse> {
		return this._client._request("GET", `/api/v1/messages/${messageId}`, {
			responseParser: models.parseMessageResponse,
		});
	}

	async stats(): Promise<models.MessageStatsResponse> {
		return this._client._request("GET", "/api/v1/messages/stats/summary", {
			responseParser: models.parseMessageStatsResponse,
		});
	}

	async send(
		payload: models.SendMessageRequest,
	): Promise<models.SendMessageResponse> {
		return this._client._request("POST", "/api/v1/messages/send", {
			jsonBody: payload,
			responseParser: models.parseSendMessageResponse,
		});
	}

	async sendImage(
		payload: models.SendMessageRequest,
	): Promise<models.SendMessageResponse> {
		return this._client._request("POST", "/api/v1/messages/send/image", {
			jsonBody: payload,
			responseParser: models.parseSendMessageResponse,
		});
	}

	async send_image(
		payload: models.SendMessageRequest,
	): Promise<models.SendMessageResponse> {
		return this.sendImage(payload);
	}

	async sendVideo(
		payload: models.SendMessageRequest,
	): Promise<models.SendMessageResponse> {
		return this._client._request("POST", "/api/v1/messages/send/video", {
			jsonBody: payload,
			responseParser: models.parseSendMessageResponse,
		});
	}

	async send_video(
		payload: models.SendMessageRequest,
	): Promise<models.SendMessageResponse> {
		return this.sendVideo(payload);
	}

	async sendVoice(
		payload: models.SendMessageRequest,
	): Promise<models.SendMessageResponse> {
		return this._client._request("POST", "/api/v1/messages/send/voice", {
			jsonBody: payload,
			responseParser: models.parseSendMessageResponse,
		});
	}

	async send_voice(
		payload: models.SendMessageRequest,
	): Promise<models.SendMessageResponse> {
		return this.sendVoice(payload);
	}

	async sendDocument(
		payload: models.SendMessageRequest,
	): Promise<models.SendMessageResponse> {
		return this._client._request("POST", "/api/v1/messages/send/document", {
			jsonBody: payload,
			responseParser: models.parseSendMessageResponse,
		});
	}

	async send_document(
		payload: models.SendMessageRequest,
	): Promise<models.SendMessageResponse> {
		return this.sendDocument(payload);
	}

	async sendLocation(
		payload: models.SendMessageRequest,
	): Promise<models.SendMessageResponse> {
		return this._client._request("POST", "/api/v1/messages/send/location", {
			jsonBody: payload,
			responseParser: models.parseSendMessageResponse,
		});
	}

	async send_location(
		payload: models.SendMessageRequest,
	): Promise<models.SendMessageResponse> {
		return this.sendLocation(payload);
	}

	async sendContact(
		payload: models.SendMessageRequest,
	): Promise<models.SendMessageResponse> {
		return this._client._request("POST", "/api/v1/messages/send/contact", {
			jsonBody: payload,
			responseParser: models.parseSendMessageResponse,
		});
	}

	async send_contact(
		payload: models.SendMessageRequest,
	): Promise<models.SendMessageResponse> {
		return this.sendContact(payload);
	}

	async retry(messageId: string): Promise<models.RetryMessageResponse> {
		return this._client._request(
			"POST",
			`/api/v1/messages/${messageId}/retry`,
			{
				responseParser: models.parseRetryMessageResponse,
			},
		);
	}

	async cancel(messageId: string): Promise<models.CancelMessageResponse> {
		return this._client._request(
			"POST",
			`/api/v1/messages/${messageId}/cancel`,
			{
				responseParser: models.parseCancelMessageResponse,
			},
		);
	}

	async sendButtons(
		payload: models.ButtonReplyRequest,
	): Promise<models.InteractiveMessageResponse> {
		return this._client._request(
			"POST",
			"/api/v1/messages/send/interactive/buttons",
			{
				jsonBody: payload,
				responseParser: models.parseInteractiveMessageResponse,
			},
		);
	}

	async send_buttons(
		payload: models.ButtonReplyRequest,
	): Promise<models.InteractiveMessageResponse> {
		return this.sendButtons(payload);
	}

	async sendList(
		payload: models.ListReplyRequest,
	): Promise<models.InteractiveMessageResponse> {
		return this._client._request(
			"POST",
			"/api/v1/messages/send/interactive/list",
			{
				jsonBody: payload,
				responseParser: models.parseInteractiveMessageResponse,
			},
		);
	}

	async send_list(
		payload: models.ListReplyRequest,
	): Promise<models.InteractiveMessageResponse> {
		return this.sendList(payload);
	}
}
