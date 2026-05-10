import {
	cloneObject,
	mapArray,
	type WazzapiModel,
	withDateFields,
} from "./base";

type ValueMap = Record<string, unknown>;

export interface BuiltinVariableInfo extends WazzapiModel {
	name: string;
	description: string;
	example: string;
}

export interface BuiltinVariablesResponse extends WazzapiModel {
	variables: BuiltinVariableInfo[];
}

export interface TemplateCreateRequest extends WazzapiModel {
	name: string;
	content: string;
	category?: string;
	media_type?: string | null;
	media_url?: string | null;
}

export interface TemplateItem extends WazzapiModel {
	id: string;
	name: string;
	category: string;
	content: string;
	variables: string[];
	builtin_variables: string[];
	custom_variables: string[];
	media_type?: string | null;
	media_url?: string | null;
	times_used: number;
	last_used_at?: Date | null;
	created_at: Date;
}

export interface TemplateListResponse extends WazzapiModel {
	data: TemplateItem[];
	pagination: ValueMap;
}

export interface TemplatePreviewRequest extends WazzapiModel {
	content?: string | null;
	template_id?: string | null;
	custom_variables?: ValueMap | null;
	contact_id?: string | null;
}

export interface TemplatePreviewResponse extends WazzapiModel {
	preview: string;
	all_variables: string[];
	builtin_variables: string[];
	custom_variables: string[];
	missing_variables: string[];
}

export interface TemplateResponse extends WazzapiModel {
	id: string;
	name: string;
	category: string;
	content: string;
	variables: string[];
	builtin_variables: string[];
	custom_variables: string[];
	media_type?: string | null;
	media_url?: string | null;
	is_active: boolean;
	times_used: number;
	last_used_at?: Date | null;
	created_at: Date;
	updated_at: Date;
}

export interface TemplateUpdateRequest extends WazzapiModel {
	name?: string | null;
	content?: string | null;
	category?: string | null;
	is_active?: boolean | null;
	media_type?: string | null;
	media_url?: string | null;
}

export function parseBuiltinVariableInfo(input: unknown): BuiltinVariableInfo {
	return cloneObject<BuiltinVariableInfo>(input);
}

export function parseBuiltinVariablesResponse(
	input: unknown,
): BuiltinVariablesResponse {
	const output = cloneObject<BuiltinVariablesResponse>(input);
	const typedInput =
		typeof input === "object" && input
			? (input as { variables?: unknown })
			: undefined;
	output.variables = mapArray(typedInput?.variables, parseBuiltinVariableInfo);
	return output;
}

export function parseTemplateItem(input: unknown): TemplateItem {
	const output = withDateFields<TemplateItem>(input, [
		"last_used_at",
		"created_at",
	]);
	if (!Array.isArray(output.variables)) {
		output.variables = [];
	}
	if (!Array.isArray(output.builtin_variables)) {
		output.builtin_variables = [];
	}
	if (!Array.isArray(output.custom_variables)) {
		output.custom_variables = [];
	}
	return output;
}

export function parseTemplateListResponse(
	input: unknown,
): TemplateListResponse {
	const output = cloneObject<TemplateListResponse>(input);
	const typedInput =
		typeof input === "object" && input
			? (input as { data?: unknown })
			: undefined;
	output.data = mapArray(typedInput?.data, parseTemplateItem);
	return output;
}

export function parseTemplatePreviewResponse(
	input: unknown,
): TemplatePreviewResponse {
	const output = cloneObject<TemplatePreviewResponse>(input);
	if (!Array.isArray(output.all_variables)) {
		output.all_variables = [];
	}
	if (!Array.isArray(output.builtin_variables)) {
		output.builtin_variables = [];
	}
	if (!Array.isArray(output.custom_variables)) {
		output.custom_variables = [];
	}
	if (!Array.isArray(output.missing_variables)) {
		output.missing_variables = [];
	}
	return output;
}

export function parseTemplateResponse(input: unknown): TemplateResponse {
	const output = withDateFields<TemplateResponse>(input, [
		"last_used_at",
		"created_at",
		"updated_at",
	]);
	if (!Array.isArray(output.variables)) {
		output.variables = [];
	}
	if (!Array.isArray(output.builtin_variables)) {
		output.builtin_variables = [];
	}
	if (!Array.isArray(output.custom_variables)) {
		output.custom_variables = [];
	}
	return output;
}
