import { uploadFile } from "@/api/file";
import {
  deleteFolder,
  createFolder,
  getRootFolders,
  getFolderChildren,
  updateFolderName,
  FolderDto
} from "@/api/folder";
import { FileDto } from "@/types/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const folderKeys = {
  all: ["folders"] as const,
  root: () => [...folderKeys.all, "root"] as const,
  children: (folderId: string) => [...folderKeys.all, "children", folderId] as const,
};

// File types & keys
export const fileKeys = {
  all: ["files"] as const,
  byFolder: (folderId: string) => [...fileKeys.all, "byFolder", folderId] as const,
};

// ─── useRootFolders ───────────────────────────────────────────────────────────

export const useRootFolders = () => {
  return useQuery<FolderDto[]>({
    queryKey: folderKeys.root(),
    queryFn: getRootFolders,
    staleTime: 1000 * 60 * 2, // 2 min
  });
};

// ─── useFolderChildren ────────────────────────────────────────────────────────

export const useFolderChildren = (folderId: string | null) => {
  return useQuery<FolderDto[]>({
    queryKey: folderKeys.children(folderId!),
    queryFn: () => getFolderChildren(folderId!),
    enabled: !!folderId,
    staleTime: 1000 * 60 * 2,
  });
};

// ─── useCreateFolder ──────────────────────────────────────────────────────────

export const useCreateFolder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ name, parentId }: { name: string; parentId: string | null }) =>
      createFolder(name, parentId),

    onSuccess: (created) => {
      // Invalidate root list or the parent's children list
      if (created.parentId) {
        queryClient.invalidateQueries({ queryKey: folderKeys.children(created.parentId) });
      } else {
        queryClient.invalidateQueries({ queryKey: folderKeys.root() });
      }
    },
  });
};

// ─── useUpdateFolderName ──────────────────────────────────────────────────────

export const useUpdateFolderName = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ folderId, name }: { folderId: string; name: string }) =>
      updateFolderName(folderId, name),

    onSuccess: (updated) => {
      // Optimistically patch root cache
      queryClient.setQueryData<FolderDto[]>(folderKeys.root(), (old) =>
        old?.map((f) => (f.id === updated.id ? updated : f)) ?? []
      );

      // Patch parent's children cache if nested
      if (updated.parentId) {
        queryClient.setQueryData<FolderDto[]>(
          folderKeys.children(updated.parentId),
          (old) => old?.map((f) => (f.id === updated.id ? updated : f)) ?? []
        );
      }

      // Safety invalidate
      queryClient.invalidateQueries({ queryKey: folderKeys.all });
    },
  });
};

// ─── useDeleteFolder ──────────────────────────────────────────────────────────

export const useDeleteFolder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (folderId: string) => deleteFolder(folderId),

    onSuccess: (_, deletedFolderId) => {
      // Remove from all folder caches optimistically
      queryClient.setQueriesData<FolderDto[]>(
        { queryKey: folderKeys.all, exact: false },
        (old) => old?.filter((f) => f.id !== deletedFolderId) ?? []
      );

      // Remove the deleted folder's children cache entry
      queryClient.removeQueries({ queryKey: folderKeys.children(deletedFolderId) });

      // Safety sync with backend
      queryClient.invalidateQueries({ queryKey: folderKeys.all, exact: false });
    },
  });
};

