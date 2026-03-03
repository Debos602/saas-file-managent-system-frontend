import { apiUrl } from "./base";
import type {
    CreateUserPayload,
    User,
    Meta,
    GetAllUsersResponse,
    UpdateProfilePayload,
    UpdateMyProfileResponse,
    DeleteUserResponse,
} from "../types/api";

export async function createUser(payload: CreateUserPayload) {
    const url = apiUrl("/user/create-user");

    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        // include credentials so backend-set cookies are preserved
        credentials: "include",
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        const message = (data && (data.message || data.error)) || `Request failed with status ${res.status}`;
        const err = new Error(message);
        Object.assign(err, { response: res, data });
        throw err;
    }

    return data;
}

// Admin: fetch all users
export async function getAllUsers(): Promise<GetAllUsersResponse> {
    const url = apiUrl("/user/");

    const res = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        const message = (data && (data.message || data.error)) || `Request failed with status ${res.status}`;
        const err = new Error(message);
        Object.assign(err, { response: res, data });
        throw err;
    }

    const users: User[] = Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.users)
            ? data.users
            : Array.isArray(data)
                ? data
                : [];

    const meta: Meta | undefined = data?.meta;

    return {
        success: data?.success ?? true,
        message: data?.message,
        data: users,
        meta,
    };
}

// Delete a user by id (admin only)
export async function deleteUser(id: string): Promise<DeleteUserResponse> {
    const url = apiUrl(`/user/${encodeURIComponent(id)}`);

    const res = await fetch(url, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        const message = (data && (data.message || data.error)) || `Request failed with status ${res.status}`;
        const err = new Error(message);
        Object.assign(err, { response: res, data });
        throw err;
    }

    return {
        success: data?.success ?? true,
        message: data?.message,
    };
}

// Update current user's profile. `payload` is serialized into `data` field
// and `file` (if provided) is sent as `file` multipart field to match server.
export async function updateMyProfile(
    payload: UpdateProfilePayload,

): Promise<UpdateMyProfileResponse> {
    const url = apiUrl("/user/update-my-profile");

    const form = new FormData();
    const bodyPayload: Record<string, any> = { ...((payload as Record<string, any>) ?? {}) };
    if (bodyPayload.role != null) bodyPayload.role = String(bodyPayload.role).toUpperCase();
    form.append("data", JSON.stringify(bodyPayload));


    const res = await fetch(url, {
        method: "PATCH",
        // Do NOT set Content-Type; the browser will set multipart boundary.
        body: form,
        credentials: "include",
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        const message = (data && (data.message || data.error)) || `Request failed with status ${res.status}`;
        const err = new Error(message);
        Object.assign(err, { response: res, data });
        throw err;
    }

    if (!data) {
        const err = new Error("Empty response from server");
        Object.assign(err, { response: res, data });
        throw err;
    }

    return {
        success: data?.success ?? true,
        message: data?.message,
        data: data?.data || data?.user || undefined,
    };
}
