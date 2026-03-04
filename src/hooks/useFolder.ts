import { deleteFolder } from "@/api/folder";
import { Folder } from "@/types/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteFolder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFolder,

    onSuccess: (_, deletedFolderId) => {
      queryClient.setQueriesData(
        { queryKey: ["folders"], exact: false },
        (old: Folder[] | undefined) =>
          old?.filter((folder) => folder.id !== deletedFolderId) ?? []
      );

      // 🔥 extra safety (backend sync)
      queryClient.invalidateQueries({
        queryKey: ["folders"],
        exact: false,
      });
    },
  });
};