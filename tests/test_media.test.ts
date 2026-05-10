import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";

import {
	_decrypt_wa_media,
	_media_info_bytes,
	downloadMedia,
	WazzapiMediaError,
} from "../src";

const PLAINTEXT = Buffer.from("hello world this is a test file", "utf8");
const MIMETYPE = "application/pdf";
const MEDIA_KEY = Buffer.alloc(32, 0).toString("base64");
const ENC_BLOB = Buffer.from(
	"FccKWyw9ko3Sh/5+aN+CnU4rvzcVLO/BJzJ3MDxDGaGUhd2wP3byXS0o",
	"base64",
);
const FILE_SHA256 = createHash("sha256").update(PLAINTEXT).digest("base64");
const ENC_SHA256 = createHash("sha256").update(ENC_BLOB).digest("base64");

describe("media", () => {
	test("decrypts media successfully", () => {
		const result = _decrypt_wa_media(MEDIA_KEY, ENC_BLOB, MIMETYPE);
		expect(result.equals(PLAINTEXT)).toBe(true);
	});

	test("media info bytes mapping works", () => {
		expect(_media_info_bytes("image/jpeg").toString("utf8")).toBe(
			"WhatsApp Image Keys",
		);
		expect(_media_info_bytes("video/mp4").toString("utf8")).toBe(
			"WhatsApp Video Keys",
		);
		expect(_media_info_bytes("audio/ogg").toString("utf8")).toBe(
			"WhatsApp Audio Keys",
		);
		expect(_media_info_bytes("application/pdf").toString("utf8")).toBe(
			"WhatsApp Document Keys",
		);
	});

	test("downloads and verifies media", async () => {
		const result = await downloadMedia(
			"https://cdn.example.com/file",
			MEDIA_KEY,
			MIMETYPE,
			{
				file_sha256: FILE_SHA256,
				file_enc_sha256: ENC_SHA256,
				file_name: "test.pdf",
				fetch: async (): Promise<Response> =>
					new Response(ENC_BLOB, { status: 200 }),
			},
		);

		expect(result.content.equals(PLAINTEXT)).toBe(true);
		expect(result.mimetype).toBe(MIMETYPE);
		expect(result.file_name).toBe("test.pdf");
		expect(result.file_size).toBe(PLAINTEXT.length);
	});

	test("throws on checksum mismatch", async () => {
		try {
			await downloadMedia("https://cdn.example.com/file", MEDIA_KEY, MIMETYPE, {
				file_sha256: createHash("sha256").update("wrong").digest("base64"),
				fetch: async (): Promise<Response> =>
					new Response(ENC_BLOB, { status: 200 }),
			});
			throw new Error("expected checksum mismatch");
		} catch (error) {
			expect(error instanceof WazzapiMediaError).toBe(true);
			expect(String(error)).toContain("file_sha256 mismatch after decryption");
		}
	});
});
