import { cloneObject, type WazzapiModel } from "./base";

export interface MediaDownloadResult extends WazzapiModel {
	content: Buffer;
	mimetype: string;
	file_name: string;
	file_size: number;
}

export function parseMediaDownloadResult(input: unknown): MediaDownloadResult {
	return cloneObject<MediaDownloadResult>(input);
}
