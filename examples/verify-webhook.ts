import {
	EVENT_HEADER,
	EVENT_ID_HEADER,
	SIGNATURE_HEADER,
	WebhookHandler,
} from "../src";

const secret = process.env.WAZZAPI_WEBHOOK_SECRET || "your-webhook-secret";
const handler = new WebhookHandler(secret);
const payload = JSON.stringify({
	id: "webhook_1",
	event_type: "message.received",
	timestamp: "2026-04-26T09:15:30Z",
	organization_id: "org_1",
	webhook_id: "wh_1",
	data: {
		message_id: "msg_1",
		phone_number: "6281234567890",
		status: "delivered",
		direction: "inbound",
		message_type: "text",
		whatsapp_account_id: "wa_1",
	},
});

const headers = {
	[SIGNATURE_HEADER]: handler.generateSignature(payload),
	[EVENT_HEADER]: "message.received",
	[EVENT_ID_HEADER]: "evt_1",
};

const webhook = handler.verifyAndParse(payload, headers);
console.log(webhook);
