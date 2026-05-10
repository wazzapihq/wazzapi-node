import {
	createDecipheriv,
	createHash,
	createHmac,
	hkdfSync,
} from "node:crypto";

import { WazzapiMediaError } from "./errors";
import type { MediaDownloadResult } from "./models";

export type { MediaDownloadResult } from "./models";

const WA_MEDIA_INFO: Record<string, Buffer> = {
	image: Buffer.from("WhatsApp Image Keys", "utf8"),
	video: Buffer.from("WhatsApp Video Keys", "utf8"),
	audio: Buffer.from("WhatsApp Audio Keys", "utf8"),
	ptt: Buffer.from("WhatsApp Audio Keys", "utf8"),
	document: Buffer.from("WhatsApp Document Keys", "utf8"),
	sticker: Buffer.from("WhatsApp Image Keys", "utf8"),
	history: Buffer.from("WhatsApp History Keys", "utf8"),
};

export function _mediaInfoBytes(mimetype: string): Buffer {
	const mt = mimetype.toLowerCase();
	if (mt.startsWith("image/")) {
		return WA_MEDIA_INFO.image;
	}
	if (mt.startsWith("video/")) {
		return WA_MEDIA_INFO.video;
	}
	if (mt.startsWith("audio/")) {
		return WA_MEDIA_INFO.audio;
	}
	return WA_MEDIA_INFO.document;
}

export function _decryptWaMedia(
	mediaKeyBase64: string,
	encryptedData: Buffer,
	mimetype: string,
): Buffer {
	if (encryptedData.length < 10) {
		throw new WazzapiMediaError("Encrypted data too short");
	}

	let mediaKey: Buffer;
	try {
		mediaKey = Buffer.from(mediaKeyBase64, "base64");
	} catch {
		throw new WazzapiMediaError("Invalid media_key base64");
	}

	if (mediaKey.length === 0) {
		throw new WazzapiMediaError("Invalid media_key base64");
	}

	const expanded = Buffer.from(
		hkdfSync(
			"sha256",
			mediaKey,
			Buffer.alloc(0),
			_mediaInfoBytes(mimetype),
			112,
		),
	);
	const iv = expanded.subarray(0, 16);
	const aesKey = expanded.subarray(16, 48);
	const macKey = expanded.subarray(48, 80);

	const ciphertext = encryptedData.subarray(0, -10);
	const mac = encryptedData.subarray(-10);
	const computedMac = createHmac("sha256", macKey)
		.update(Buffer.concat([iv, ciphertext]))
		.digest()
		.subarray(0, 10);

	if (!computedMac.equals(mac)) {
		throw new WazzapiMediaError(
			"MAC verification failed — media may be corrupted or mediaKey is wrong",
		);
	}

	const decipher = createDecipheriv("aes-256-cbc", aesKey, iv);
	decipher.setAutoPadding(false);
	const paddedPlaintext = Buffer.concat([
		decipher.update(ciphertext),
		decipher.final(),
	]);

	if (paddedPlaintext.length === 0) {
		throw new WazzapiMediaError("Decrypted plaintext is empty");
	}

	const padLen = paddedPlaintext[paddedPlaintext.length - 1];
	if (padLen === 0 || padLen > 16 || padLen > paddedPlaintext.length) {
		throw new WazzapiMediaError("Invalid PKCS7 padding");
	}

	for (
		let i = paddedPlaintext.length - padLen;
		i < paddedPlaintext.length;
		i += 1
	) {
		if (paddedPlaintext[i] !== padLen) {
			throw new WazzapiMediaError("Invalid PKCS7 padding");
		}
	}

	return paddedPlaintext.subarray(0, paddedPlaintext.length - padLen);
}

export interface DownloadMediaOptions {
	file_sha256?: string | null;
	file_enc_sha256?: string | null;
	file_name?: string | null;
	fetch?: typeof fetch;
}

export async function downloadMedia(
	url: string,
	mediaKey: string,
	mimetype: string,
	options?: DownloadMediaOptions,
): Promise<MediaDownloadResult> {
	const fetcher = options?.fetch ?? fetch;
	let response: Response;

	try {
		response = await fetcher(url);
	} catch (error) {
		throw new WazzapiMediaError(`CDN fetch error: ${String(error)}`);
	}

	if (!response.ok) {
		throw new WazzapiMediaError(`CDN fetch failed: ${response.status}`);
	}

	const encryptedData = Buffer.from(await response.arrayBuffer());

	if (options?.file_enc_sha256) {
		const expectedEncrypted = Buffer.from(options.file_enc_sha256, "base64");
		const actualEncrypted = createHash("sha256").update(encryptedData).digest();
		if (!actualEncrypted.equals(expectedEncrypted)) {
			throw new WazzapiMediaError(
				`file_enc_sha256 mismatch: CDN returned wrong data (got ${encryptedData.length} bytes)`,
			);
		}
	}

	const plaintext = _decryptWaMedia(mediaKey, encryptedData, mimetype);

	if (options?.file_sha256) {
		const expectedPlain = Buffer.from(options.file_sha256, "base64");
		const actualPlain = createHash("sha256").update(plaintext).digest();
		if (!actualPlain.equals(expectedPlain)) {
			throw new WazzapiMediaError("file_sha256 mismatch after decryption");
		}
	}

	return {
		content: plaintext,
		mimetype,
		file_name: options?.file_name || "media",
		file_size: plaintext.length,
	};
}

export const download_media = downloadMedia;
export const _decrypt_wa_media = _decryptWaMedia;
export const _media_info_bytes = _mediaInfoBytes;
