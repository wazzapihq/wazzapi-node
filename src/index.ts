export { DEFAULT_BASE_URL, WazzapiClient } from "./client";
export { WazzapiAPIError, WazzapiError, WazzapiMediaError } from "./errors";
export {
	_decrypt_wa_media,
	_decryptWaMedia,
	_media_info_bytes,
	_mediaInfoBytes,
	download_media,
	downloadMedia,
} from "./media";
export type { MediaDownloadResult } from "./models";
export * as models from "./models";
export type { WazzapiModel } from "./models/base";
export * from "./models/contacts";
export * from "./models/devices";
export * from "./models/groups";
export * from "./models/media";
export * from "./models/messages";
export * from "./models/templates";
export * from "./models/webhooks";
export {
	EVENT_HEADER,
	EVENT_ID_HEADER,
	generate_webhook_signature,
	generateWebhookSignature,
	parse_webhook,
	parseWebhook,
	SIGNATURE_HEADER,
	verify_webhook_signature,
	verifyWebhookSignature,
	WazzapiWebhookError,
	WazzapiWebhookParseError,
	WazzapiWebhookVerificationError,
	WebhookHandler,
} from "./webhooks";

export const __version__ = "0.4.0";
