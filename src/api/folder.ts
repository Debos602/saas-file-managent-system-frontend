import { apiUrl } from "./base";
import { FileDto } from "@/types/api";

export type FolderDto = {
  id: string;
  name: string;
  userId: string;
  parentId: string | null;
  level: number;
  createdAt: string;
  updatedAt: string;
};

export async function getRootFolders(): Promise<FolderDto[]> {
  const url = apiUrl("/folders/root");

  const res = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message = (data && (data.message || data.error)) || `Request failed with status ${res.status}`;
    const err = new Error(message);
    // attach response/data without using `any` casts
    Object.assign(err, { response: res, data });
    throw err;
  }

  // Expect API shape: { success, message, data: FolderDto[] }
  if (!Array.isArray(data?.data)) return [];
  return data.data as FolderDto[];
}

export default getRootFolders;

export async function getFolderChildren(folderId: string): Promise<FolderDto[]> {
  const url = apiUrl(`/folders/${encodeURIComponent(folderId)}/children`);

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

  if (!Array.isArray(data?.data)) return [];
  return data.data as FolderDto[];
}

export async function updateFolderName(folderId: string, name: string): Promise<FolderDto> {
  const url = apiUrl(`/folders/${encodeURIComponent(folderId)}`);

  const res = await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ name }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message = (data && (data.message || data.error)) || `Request failed with status ${res.status}`;
    const err = new Error(message);
    Object.assign(err, { response: res, data });
    throw err;
  }

  // Expect API to return the updated folder in data.data or data
  return (data?.data ?? data) as FolderDto;
}

export async function createFolder(name: string, parentId: string | null): Promise<FolderDto> {
  const url = apiUrl(`/folders`);

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ name, parentId }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message = (data && (data.message || data.error)) || `Request failed with status ${res.status}`;
    const err = new Error(message);
    Object.assign(err, { response: res, data });
    throw err;
  }

  return (data?.data ?? data) as FolderDto;
}

export async function deleteFolder(folderId: string): Promise<void> {
  const url = apiUrl(`/folders/${encodeURIComponent(folderId)}`);

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

  return;
}
