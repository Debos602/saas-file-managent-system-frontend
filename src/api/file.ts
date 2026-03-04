import { apiUrl } from "./base";
import { FileDto } from "@/types/api";

export async function getFilesByFolder(folderId: string): Promise<FileDto[]> {
  const url = apiUrl(`/files/folder/${encodeURIComponent(folderId)}`);
  const res = await fetch(url, { method: "GET", headers: { "Content-Type": "application/json" }, credentials: "include" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = (data && (data.message || data.error)) || `Request failed with status ${res.status}`;
    const err = new Error(message);
    Object.assign(err, { response: res, data });
    throw err;
  }
  if (!Array.isArray(data?.data)) return [];
  return data.data as FileDto[];
}

export async function deleteFile(fileId: string): Promise<void> {
  const url = apiUrl(`/files/${encodeURIComponent(fileId)}`);
  const res = await fetch(url, { method: "DELETE", headers: { "Content-Type": "application/json" }, credentials: "include" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = (data && (data.message || data.error)) || `Request failed with status ${res.status}`;
    const err = new Error(message);
    Object.assign(err, { response: res, data });
    throw err;
  }
  return;
}

export async function renameFile(fileId: string, name: string): Promise<FileDto> {
  const url = apiUrl(`/files/${encodeURIComponent(fileId)}`);
  const res = await fetch(url, { method: "PATCH", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ name }) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = (data && (data.message || data.error)) || `Request failed with status ${res.status}`;
    const err = new Error(message);
    Object.assign(err, { response: res, data });
    throw err;
  }
  return (data?.data ?? data) as FileDto;
}

export default getFilesByFolder;
export async function uploadFile(
  file: File,
  folderId: string,
  userId?: string,
  onProgress?: (percent: number) => void
): Promise<FileDto> {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folderId", folderId);
    if (userId) formData.append("user", userId);

    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    });

    xhr.addEventListener("load", () => {
      try {
        const data = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve((data?.data ?? data) as FileDto);
        } else {
          const message = (data && (data.message || data.error)) || `Upload failed with status ${xhr.status}`;
          reject(new Error(message));
        }
      } catch {
        reject(new Error("Failed to parse upload response"));
      }
    });

    xhr.addEventListener("error", () => reject(new Error("Network error during upload")));
    xhr.addEventListener("abort", () => reject(new Error("Upload aborted")));

    const url = apiUrl("/files/");
    xhr.open("POST", url);
    xhr.withCredentials = true;
    xhr.send(formData);
  });
}