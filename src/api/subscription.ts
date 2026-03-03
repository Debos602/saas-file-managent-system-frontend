import { apiUrl } from "./base";
import type { GetPackagesResponse } from "../types/api";

export async function getPackages(page = 1, limit = 5): Promise<GetPackagesResponse> {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    const url = apiUrl(`/subscription/packages?${params.toString()}`);

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

    const packages = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];

    return {
        success: data?.success ?? true,
        message: data?.message,
        data: packages,
        meta: data?.meta,
    } as GetPackagesResponse;
}

export default getPackages;

export async function createPackage(payload: Record<string, unknown>) {
    const url = apiUrl(`/subscription/packages`);

    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
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

export async function updatePackage(id: string, payload: Record<string, unknown>) {
    const url = apiUrl(`/subscription/packages/${encodeURIComponent(id)}`);

    const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
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

export async function deletePackage(id: string) {
    const url = apiUrl(`/subscription/packages/${encodeURIComponent(id)}`);

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

    return data;
}
