import { apiUrl } from "./base";

export async function getDashboardStats() {
    const url = apiUrl("/admin/dashboard");

    const res = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
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

    // Return normalized payload (prefer data.data or data)
    return data?.data ?? data;
}

export default getDashboardStats;
