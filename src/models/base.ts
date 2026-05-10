export interface WazzapiModel {
	[key: string]: unknown;
}

export type JsonRecord = Record<string, unknown>;

export function cloneObject<T extends WazzapiModel>(input: unknown): T {
	if (!input || typeof input !== "object") {
		return {} as T;
	}

	const output: WazzapiModel = {};
	Object.entries(input).forEach(([key, value]) => {
		output[key] = value;
	});

	return output as T;
}

export function withDateFields<T extends WazzapiModel>(
	input: unknown,
	fields: string[],
): T {
	const output = cloneObject<T>(input);
	const mutableOutput = output as WazzapiModel;

	fields.forEach((field) => {
		if (mutableOutput[field] !== undefined && mutableOutput[field] !== null) {
			mutableOutput[field] = new Date(
				mutableOutput[field] as string | number | Date,
			);
		}
	});

	return output;
}

export function mapArray<T>(value: unknown, parser: (item: unknown) => T): T[] {
	if (!Array.isArray(value)) {
		return [];
	}

	return value.map((item) => parser(item));
}

export function serializeData(value: unknown): unknown {
	if (value === undefined || value === null) {
		return undefined;
	}

	if (value instanceof Date) {
		return value.toISOString();
	}

	if (Buffer.isBuffer(value) || value instanceof Uint8Array) {
		return value;
	}

	if (Array.isArray(value)) {
		return value
			.map((item) => serializeData(item))
			.filter((item) => item !== undefined);
	}

	if (typeof value === "object") {
		const output: WazzapiModel = {};
		Object.entries(value).forEach(([key, rawValue]) => {
			const serialized = serializeData(rawValue);
			if (serialized !== undefined) {
				output[key] = serialized;
			}
		});

		return output;
	}

	return value;
}

export function filterNone<T extends JsonRecord>(
	data?: T,
): Partial<T> | undefined {
	if (!data) {
		return undefined;
	}

	const output: Partial<T> = {};
	Object.entries(data).forEach(([key, value]) => {
		if (value !== undefined && value !== null) {
			output[key as keyof T] = value as T[keyof T];
		}
	});

	return output;
}
