import { apiUrl } from "./base";
import type { LoginPayload } from "../types/api";

export async function login(payload: LoginPayload) {
    const url = apiUrl("/auth/login");

    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        // include credentials so cookie-setters on the backend are preserved
        credentials: "include",
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        const message = (data && (data.message || data.error)) || `Request failed with status ${res.status}`;
        const err: any = new Error(message);
        err.response = res;
        err.data = data;
        throw err;
    }

    return data;
}

export async function refreshAccessToken() {
    const url = apiUrl("/auth/refresh-token");

    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // 🔥 must
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        return false;
    }

    return true;
}

export async function getCurrentUser() {
    const url = apiUrl("/auth/me");

    let res = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
    });

    // যদি 401 আসে → refresh try করবো
    if (res.status === 401) {
        const refreshed = await refreshAccessToken();

        if (!refreshed) return null;

        // আবার try করবো
        res = await fetch(url, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });
    }

    if (!res.ok) return null;

    const data = await res.json().catch(() => ({}));

    return data?.user || data?.data || data;
}

export async function logout() {
    const url = apiUrl("/auth/logout");

    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
    });

    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const message = (data && (data.message || data.error)) || `Request failed with status ${res.status}`;
        const err: any = new Error(message);
        err.response = res;
        err.data = data;
        throw err;
    }

    return true;
}
