import { cloneObject, mapArray, type WazzapiModel } from "./base";

export interface GroupListItem extends WazzapiModel {
	id: string;
	name: string;
	description?: string | null;
	owner?: string | null;
	participants_count: number;
}

export interface GroupListResponse extends WazzapiModel {
	groups: GroupListItem[];
	total: number;
}

export interface GroupDetailResponse extends WazzapiModel {
	id: string;
	name: string;
	description?: string | null;
	owner?: string | null;
	participants_count: number;
}

export interface GroupParticipantItem extends WazzapiModel {
	id: string;
	is_admin: boolean;
	is_super_admin: boolean;
}

export interface GroupParticipantsResponse extends WazzapiModel {
	participants: GroupParticipantItem[];
}

export interface GroupOperationResponseModel extends WazzapiModel {
	success: boolean;
	details: string;
}

export interface CreateGroupRequest extends WazzapiModel {
	session_name: string;
	name: string;
	participants: string[];
}

export interface CreateGroupResponseModel extends WazzapiModel {
	success: boolean;
	jid: string;
	name: string;
	owner_jid?: string | null;
	group_created?: string | null;
}

export interface SendGroupTextRequest extends WazzapiModel {
	session_name: string;
	group_jid: string;
	text: string;
	message_id?: string | null;
}

export interface SendGroupMediaRequest extends WazzapiModel {
	session_name: string;
	group_jid: string;
	media_url: string;
	media_type: string;
	caption?: string | null;
	filename?: string | null;
}

export interface SendGroupResponse extends WazzapiModel {
	success: boolean;
	message_id: string;
	status: string;
	run_id?: string | null;
}

export interface UpdateParticipantsRequest extends WazzapiModel {
	session_name: string;
	group_jid: string;
	action: string;
	participants: string[];
}

export interface GroupInviteLinkResponseModel extends WazzapiModel {
	success: boolean;
	invite_link: string;
}

export interface GroupInviteInfoResponseModel extends WazzapiModel {
	success: boolean;
	jid: string;
	name: string;
	participants: number;
	owner_jid?: string | null;
}

export interface InviteInfoRequest extends WazzapiModel {
	session_name: string;
	invite_link: string;
}

export interface JoinGroupRequest extends WazzapiModel {
	session_name: string;
	invite_link: string;
}

export interface SetGroupNameRequest extends WazzapiModel {
	session_name: string;
	name: string;
}

export interface SetGroupTopicRequest extends WazzapiModel {
	session_name: string;
	topic: string;
}

export interface SetGroupPhotoRequest extends WazzapiModel {
	session_name: string;
	image_data_uri: string;
}

export interface SetGroupAnnounceRequest extends WazzapiModel {
	session_name: string;
	announce: boolean;
}

export interface SetGroupLockedRequest extends WazzapiModel {
	session_name: string;
	locked: boolean;
}

export interface SetGroupEphemeralRequest extends WazzapiModel {
	session_name: string;
	duration: string;
}

export function parseGroupListItem(input: unknown): GroupListItem {
	const output = cloneObject<GroupListItem>(input);
	output.participants_count ??= 0;
	return output;
}

export function parseGroupListResponse(input: unknown): GroupListResponse {
	const output = cloneObject<GroupListResponse>(input);
	output.groups = mapArray(
		(input as { groups?: unknown } | undefined)?.groups,
		parseGroupListItem,
	);
	return output;
}

export function parseGroupDetailResponse(input: unknown): GroupDetailResponse {
	const output = cloneObject<GroupDetailResponse>(input);
	output.participants_count ??= 0;
	return output;
}

export function parseGroupParticipantItem(
	input: unknown,
): GroupParticipantItem {
	const output = cloneObject<GroupParticipantItem>(input);
	output.is_admin ??= false;
	output.is_super_admin ??= false;
	return output;
}

export function parseGroupParticipantsResponse(
	input: unknown,
): GroupParticipantsResponse {
	const output = cloneObject<GroupParticipantsResponse>(input);
	output.participants = mapArray(
		(input as { participants?: unknown } | undefined)?.participants,
		parseGroupParticipantItem,
	);
	return output;
}

export function parseGroupOperationResponseModel(
	input: unknown,
): GroupOperationResponseModel {
	return cloneObject<GroupOperationResponseModel>(input);
}

export function parseCreateGroupResponseModel(
	input: unknown,
): CreateGroupResponseModel {
	return cloneObject<CreateGroupResponseModel>(input);
}

export function parseSendGroupResponse(input: unknown): SendGroupResponse {
	return cloneObject<SendGroupResponse>(input);
}

export function parseGroupInviteLinkResponseModel(
	input: unknown,
): GroupInviteLinkResponseModel {
	return cloneObject<GroupInviteLinkResponseModel>(input);
}

export function parseGroupInviteInfoResponseModel(
	input: unknown,
): GroupInviteInfoResponseModel {
	const output = cloneObject<GroupInviteInfoResponseModel>(input);
	output.participants ??= 0;
	return output;
}
