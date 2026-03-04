import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getFilesByFolder, deleteFile, renameFile, uploadFile } from "@/api/file";
import { FileDto } from "@/types/api";
import { fileKeys } from "@/hooks/useFolder";

export const useFilesByFolder = (folderId: string | null) => {
  const key = fileKeys.byFolder(folderId ?? "root");
  return useQuery<FileDto[]>({
    queryKey: key,
    queryFn: () => getFilesByFolder(folderId ?? "root"),
    enabled: true,
    staleTime: 1000 * 60 * 2,
  });
};

export const useUploadFile = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ file, folderId, user, onProgress }: { file: File; folderId: string | null; user?: string; onProgress?: (p: number) => void }) =>
      uploadFile(file, folderId ?? "root", user, onProgress),
    onSuccess: (uploaded: FileDto) => {
      queryClient.setQueryData<FileDto[]>(fileKeys.byFolder(uploaded.folderId), (old) => (old ? [...old, uploaded] : [uploaded]));
      queryClient.invalidateQueries({ queryKey: fileKeys.byFolder(uploaded.folderId) });
    },
  });

  return mutation;
};

export const useDeleteFile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (fileId: string) => deleteFile(fileId),
    onSuccess: () => {
      // best-effort: invalidate all file folder queries
      queryClient.invalidateQueries({ queryKey: ["files"], exact: false });
    },
  });
};

export const useRenameFile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ fileId, name }: { fileId: string; name: string }) => renameFile(fileId, name),
    onSuccess: (updated: FileDto) => {
      queryClient.setQueryData<FileDto[]>(fileKeys.byFolder(updated.folderId), (old) => old?.map((f) => (f.id === updated.id ? updated : f)) ?? []);
      queryClient.invalidateQueries({ queryKey: fileKeys.byFolder(updated.folderId) });
    },
  });
};

export default useFilesByFolder;
