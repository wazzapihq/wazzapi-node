export class WazzapiError extends Error {
	constructor(message?: string) {
		super(message);
		this.name = "WazzapiError";
		Object.setPrototypeOf(this, new.target.prototype);
	}
}

export class WazzapiAPIError extends WazzapiError {
	readonly statusCode: number;
	override readonly message: string;
	readonly details?: unknown;
	responseText?: string;

	constructor(
		statusCode: number,
		message: string,
		options?: { details?: unknown; responseText?: string },
	) {
		super(`WazzAPI API error ${statusCode}: ${message}`);
		this.name = "WazzapiAPIError";
		this.statusCode = statusCode;
		this.message = message;
		this.details = options?.details;
		this.responseText = options?.responseText;
	}

	static fromResponseParts(
		statusCode: number,
		reasonPhrase: string,
		responseText?: string,
		payload?: unknown,
	): WazzapiAPIError {
		let details: unknown;
		let message = reasonPhrase || "Request failed";

		if (payload && typeof payload === "object" && !Array.isArray(payload)) {
			const normalizedPayload = payload as {
				detail?: unknown;
				message?: unknown;
			};
			details =
				normalizedPayload.detail === undefined
					? payload
					: normalizedPayload.detail;

			if (typeof details === "string") {
				message = details;
			} else if (Array.isArray(details) && details.length > 0) {
				const firstItem = details[0];
				if (
					firstItem &&
					typeof firstItem === "object" &&
					"msg" in firstItem &&
					typeof firstItem.msg === "string"
				) {
					message = firstItem.msg;
				} else {
					message = formatErrorMessage(firstItem);
				}
			} else if (normalizedPayload.message !== undefined) {
				message = formatErrorMessage(normalizedPayload.message);
			}
		} else if (payload !== undefined) {
			details = payload;
			message = formatErrorMessage(payload);
		}

		return new WazzapiAPIError(statusCode, message, {
			details: details,
			responseText: responseText,
		});
	}
}

function formatErrorMessage(value: unknown): string {
	if (typeof value === "string") {
		return value;
	}

	if (value === undefined || value === null) {
		return "Request failed";
	}

	try {
		const serialized = JSON.stringify(value);
		return serialized ?? "Request failed";
	} catch {
		return "Request failed";
	}
}

export class WazzapiMediaError extends WazzapiError {
	constructor(message: string) {
		super(message);
		this.name = "WazzapiMediaError";
	}
}
