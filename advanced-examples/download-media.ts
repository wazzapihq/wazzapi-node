import { downloadMedia } from "../src";

function requireEnv(name: string): string {
	const value = process.env[name];
	if (!value) {
		throw new Error(`Missing required environment variable: ${name}`);
	}

	return value;
}

const result = await downloadMedia(
	requireEnv("WAZZAPI_MEDIA_URL"),
	requireEnv("WAZZAPI_MEDIA_KEY"),
	process.env.WAZZAPI_MEDIA_MIMETYPE || "application/octet-stream",
	{
		file_name: process.env.WAZZAPI_MEDIA_FILE_NAME || "media.bin",
		file_sha256: process.env.WAZZAPI_MEDIA_SHA256 || undefined,
		file_enc_sha256: process.env.WAZZAPI_MEDIA_ENC_SHA256 || undefined,
	},
);

console.log({
	file_name: result.file_name,
	file_size: result.file_size,
	mimetype: result.mimetype,
});
