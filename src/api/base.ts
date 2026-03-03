// Support both VITE_API_BASE_URL and legacy VITE_BASE_URL env names
const RAW_BASE = (import.meta.env.VITE_API_BASE_URL as string) || (import.meta.env.VITE_BASE_URL as string) || "";
export const BASE = RAW_BASE.replace(/\/$/, "");

export function apiUrl(path: string) {
    if (!path.startsWith("/")) path = "/" + path;
    return BASE ? `${BASE}${path}` : path;
}

export default apiUrl;
