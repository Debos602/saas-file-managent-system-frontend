import React, { useState, useEffect, useRef } from "react";
import { 
  Folder, 
  File, 
  MoreVertical, 
  Plus, 
  Upload, 
  Download, 
  Trash2, 
  Edit2,
  ChevronRight,
  Grid,
  List,
  Search,
  ArrowUp,
  Image,
  Video,
  Music,
  FileText,
  File as FileIcon,
  FolderPlus,
  X
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { getRootFolders, getFolderChildren, createFolder, deleteFolder, updateFolderName, FolderDto } from "@/api/folder";
import { toast } from "@/components/ui/use-toast";
import { useDeleteFolder } from "@/hooks/useFolder";
import { useUploadFile } from "@/hooks/useFile";

// Types
interface FileItem {
  id: string;
  name: string;
  type: 'file';
  fileType: 'image' | 'video' | 'audio' | 'pdf' | 'other';
  size: string;
  modified: string;
  icon: React.ComponentType<{ className?: string }>;
  color?: string;
}

interface FolderItem {
  id: string;
  name: string;
  type: 'folder';
  itemCount: number;
  modified: string;
  children?: (FolderItem | FileItem)[];
}

type FileSystemItem = FolderItem | FileItem;

export default function UserFiles() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentFolder, setCurrentFolder] = useState<FolderItem | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<FolderItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<FileSystemItem | null>(null);
  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false);
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [renameValue, setRenameValue] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [rootItems, setRootItems] = useState<FolderItem[]>([]);
  const [loadingRoot, setLoadingRoot] = useState(false);
  const [rootError, setRootError] = useState<string | null>(null);
  const [loadingChildren, setLoadingChildren] = useState(false);
  const [childrenError, setChildrenError] = useState<string | null>(null);


  const { mutate: deleteFolderMutation, isPending: isDeleting } = useDeleteFolder();
  const { mutate: uploadFileMutate } = useUploadFile();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Get current items (either root or folder contents)
  const currentItems = currentFolder?.children || rootItems;

  // Filter items based on search
  const filteredItems = currentItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle folder navigation: fetch children when entering a folder
  const handleFolderClick = async (folder: FolderItem) => {
    setChildrenError(null);
    setLoadingChildren(true);
    try {
      // If children already loaded, reuse
      if (!folder.children || folder.children.length === 0) {
        const children = await getFolderChildren(folder.id);
        const childItems: FolderItem[] = children.map((f: FolderDto) => ({
          id: f.id,
          name: f.name,
          type: 'folder',
          itemCount: 0,
          modified: f.updatedAt || f.createdAt || new Date().toISOString(),
          children: [],
        }));

        // update rootItems (or top-level listing) to cache children
        setRootItems((prev) => prev.map((r) => (r.id === folder.id ? { ...r, children: childItems } : r)));

        // replace local folder reference with enriched one
        folder = { ...folder, children: childItems };
      }

      setBreadcrumbs((b) => [...b, folder]);
      setCurrentFolder(folder);
    } catch (err: unknown) {
      console.error('Failed to load children for folder', folder.id, err);
      const message = err instanceof Error ? err.message : String(err);
      setChildrenError(message);
    } finally {
      setLoadingChildren(false);
    }
  };

  const handleBreadcrumbClick = (index: number) => {
    const newBreadcrumbs = breadcrumbs.slice(0, index + 1);
    setBreadcrumbs(newBreadcrumbs);
    setCurrentFolder(newBreadcrumbs[newBreadcrumbs.length - 1] || null);
  };

  const handleBack = () => {
    if (breadcrumbs.length > 0) {
      const newBreadcrumbs = breadcrumbs.slice(0, -1);
      setBreadcrumbs(newBreadcrumbs);
      setCurrentFolder(newBreadcrumbs[newBreadcrumbs.length - 1] || null);
    }
  };

  // File/Folder actions
  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    const name = newFolderName.trim();
    setShowNewFolderDialog(false);
    setNewFolderName('');

    try {
      const created = await createFolder(name, currentFolder?.id ?? null);

      // If viewing root, refresh root list; if inside a folder, refresh its children
      if (!currentFolder) {
        const folders = await getRootFolders();
        const data: FolderItem[] = folders.map((f: FolderDto) => ({
          id: f.id,
          name: f.name,
          type: 'folder',
          itemCount: 0,
          modified: f.updatedAt || f.createdAt || new Date().toISOString(),
          children: [],
        }));
        setRootItems(data);
      } else {
        const children = await getFolderChildren(currentFolder.id);
        const childItems: FolderItem[] = children.map((f: FolderDto) => ({
          id: f.id,
          name: f.name,
          type: 'folder',
          itemCount: 0,
          modified: f.updatedAt || f.createdAt || new Date().toISOString(),
          children: [],
        }));
        setCurrentFolder((cf) => cf ? { ...cf, children: childItems } : cf);
        setRootItems((prev) => prev.map((r) => (r.id === currentFolder.id ? { ...r, children: childItems } : r)));
      }

      toast({ title: 'Folder created', description: `"${created.name}" created` });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      toast({ title: 'Create failed', description: message });
    }
  };

  // Fetch root folders on mount
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoadingRoot(true);
      setRootError(null);
      try {
        const folders = await getRootFolders();
        if (!mounted) return;
        // map API folders to FolderItem shape
        const data: FolderItem[] = folders.map((f: FolderDto) => ({
          id: f.id,
          name: f.name,
          type: 'folder',
          itemCount: 0,
          modified: f.updatedAt || f.createdAt || new Date().toISOString(),
          children: [],
        }));
        setRootItems(data);
      } catch (err: unknown) {
        console.error("Failed to load root folders", err);
        const message = err instanceof Error ? err.message : String(err);
        setRootError(message);
      } finally {
        if (mounted) setLoadingRoot(false);
      }
    };

    load();
    return () => { mounted = false; };
  }, []);

  const handleRename = async () => {
    if (!renameValue.trim() || !selectedItem) return;

    const newName = renameValue.trim();

    try {
      if (selectedItem.type !== 'folder') {
        toast({ title: 'Rename', description: 'File rename not implemented.' });
      } else {
        const updated = await updateFolderName(selectedItem.id, newName);

        // update rootItems
        setRootItems((prev) => prev.map((r) => (r.id === updated.id ? { ...r, name: updated.name } : r)));

        // update currentFolder
        if (currentFolder && currentFolder.id === updated.id) {
          setCurrentFolder((cf) => cf ? { ...cf, name: updated.name } : cf);
        }

        // update breadcrumbs
        setBreadcrumbs((b) => b.map((bf) => (bf.id === updated.id ? { ...bf, name: updated.name } : bf)));

        toast({ title: 'Folder renamed', description: `Renamed to "${updated.name}"` });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      toast({ title: 'Rename failed', description: message });
    } finally {
      setRenameValue('');
      setShowRenameDialog(false);
      setSelectedItem(null);
    }
  };

  const handleDelete =  () => {
    if (!selectedItem) return;
    const id = selectedItem.id;
    setShowDeleteDialog(false);
    deleteFolderMutation(id);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    // fixed user and folder id as requested
    const userId = "300cba1d-93e8-4bcd-aa60-45753dbfd4d9";
    const folderId = currentFolder?.id ?? "03a1bdbd-1bd2-41db-bc25-8bcfe134dc94";

    uploadFileMutate(
      { file, folderId, user: userId, onProgress: (p: number) => setUploadProgress(p) },
      {
        onSuccess: () => {
          setIsUploading(false);
          setShowUploadDialog(false);
          setUploadProgress(0);
          toast({ title: "Upload complete", description: `${file.name} uploaded` });
        },
        onError: (err: unknown) => {
          setIsUploading(false);
          setUploadProgress(0);
          const message = err instanceof Error ? err.message : String(err);
          toast({ title: "Upload failed", description: message });
        },
      }
    );
    // clear the input so same file can be selected again
    e.currentTarget.value = "";
  };

  // Get file icon component
  const getFileIcon = (item: FileItem) => {
    const IconComponent = item.icon;
    return <IconComponent className={cn("h-5 w-5", item.color)} />;
  };

  // Storage usage (mock data)
  const storageUsed = 45; // percentage
  const totalStorage = '100 GB';
  const usedStorage = '45 GB';

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight bgz-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            My Files
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your files and folders efficiently
          </p>
        </div>

        {/* Storage indicator */}
        <Card className="p-3 bg-primary/5 border-primary/10">
          <div className="flex items-center gap-3">
            <div className="text-sm">
              <p className="font-medium">{usedStorage} / {totalStorage}</p>
              <p className="text-xs text-muted-foreground">Storage used</p>
            </div>
            <Progress value={storageUsed} className="w-24 h-2" />
          </div>
        </Card>
      </div>

      {/* Action Bar */}
      <Card className="rounded-xl shadow-sm border-0 bg-gradient-to-br from-background to-muted/20">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <Button 
                size="sm" 
                className="rounded-lg gap-2"
                onClick={() => setShowNewFolderDialog(true)}
              >
                <FolderPlus className="h-4 w-4" />
                <span className="hidden sm:inline">New Folder</span>
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="rounded-lg gap-2"
                onClick={() => setShowUploadDialog(true)}
              >
                <Upload className="h-4 w-4" />
                <span className="hidden sm:inline">Upload</span>
              </Button>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {/* Search */}
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 rounded-lg w-full sm:w-[200px] lg:w-[300px]"
                />
              </div>

              {/* View toggle */}
              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'grid' | 'list')}>
                <TabsList className="rounded-lg">
                  <TabsTrigger value="grid" className="rounded-lg px-3">
                    <Grid className="h-4 w-4" />
                  </TabsTrigger>
                  <TabsTrigger value="list" className="rounded-lg px-3">
                    <List className="h-4 w-4" />
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          {/* Breadcrumbs */}
          {(breadcrumbs.length > 0 || currentFolder) && (
            <div className="flex items-center gap-2 mt-4 text-sm flex-wrap">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 rounded-lg"
                onClick={handleBack}
              >
                <ArrowUp className="h-4 w-4 mr-1" />
                Back
              </Button>
              <div className="flex items-center flex-wrap gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 rounded-lg"
                  onClick={() => {
                    setBreadcrumbs([]);
                    setCurrentFolder(null);
                  }}
                >
                  My Files
                </Button>
                {breadcrumbs.map((folder, index) => (
                  <div key={folder.id} className="flex items-center">
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 rounded-lg"
                      onClick={() => handleBreadcrumbClick(index)}
                    >
                      {folder.name}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Root folders loading / error */}
      {loadingRoot && (
        <Card className="rounded-xl border-0">
          <CardContent className="p-4 text-sm text-muted-foreground">Loading folders...</CardContent>
        </Card>
      )}

      {rootError && (
        <Card className="rounded-xl border-0">
          <CardContent className="p-4 text-sm text-red-600">Failed to load folders: {rootError}</CardContent>
        </Card>
      )}

      {/* Files Grid/List View */}
      {filteredItems.length > 0 ? (
        viewMode === 'grid' ? (
          // Grid View
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredItems.map((item) => (
              <Card
                key={item.id}
                className="group rounded-xl hover:shadow-lg transition-all duration-200 border-0 bg-gradient-to-br from-background to-muted/30 cursor-pointer"
                onClick={() => item.type === 'folder' ? handleFolderClick(item as FolderItem) : null}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {item.type === 'folder' ? (
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Folder className="h-6 w-6 text-primary" />
                        </div>
                      ) : (
                        <div className="p-2 bg-muted rounded-lg">
                          {getFileIcon(item as FileItem)}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.type === 'folder' 
                            ? `${(item as FolderItem).itemCount} items` 
                            : (item as FileItem).size}
                        </p>
                      </div>
                    </div>

                    {/* Actions dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-lg">
                        {item.type === 'file' && (
                          <DropdownMenuItem className="gap-2" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                            <Download className="h-4 w-4" /> Download
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem 
                          className="gap-2"
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            setSelectedItem(item);
                            setRenameValue(item.name);
                            setShowRenameDialog(true);
                          }}
                        >
                          <Edit2 className="h-4 w-4" /> Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="gap-2 text-destructive"
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            setSelectedItem(item);
                            setShowDeleteDialog(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* File type badge for files */}
                  {item.type === 'file' && (
                    <Badge variant="secondary" className="mt-2 rounded-md">
                      {(item as FileItem).fileType}
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          // List View
          <Card className="rounded-xl border-0 shadow-sm">
            <CardContent className="p-0">
              <div className="divide-y">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors cursor-pointer group"
                    onClick={() => item.type === 'folder' ? handleFolderClick(item as FolderItem) : null}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {item.type === 'folder' ? (
                        <Folder className="h-5 w-5 text-primary flex-shrink-0" />
                      ) : (
                        getFileIcon(item as FileItem)
                      )}
                      <span className="font-medium truncate">{item.name}</span>
                      {item.type === 'file' && (
                        <Badge variant="secondary" className="rounded-md text-xs">
                          {(item as FileItem).fileType}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="hidden md:inline">{item.modified}</span>
                      <span>{item.type === 'folder' ? `${(item as FolderItem).itemCount} items` : (item as FileItem).size}</span>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-lg">
                            {item.type === 'file' && (
                              <DropdownMenuItem className="gap-2" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                                <Download className="h-4 w-4" /> Download
                              </DropdownMenuItem>
                            )}
                          <DropdownMenuItem 
                            className="gap-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedItem(item);
                              setRenameValue(item.name);
                              setShowRenameDialog(true);
                            }}
                          >
                            <Edit2 className="h-4 w-4" /> Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="gap-2 text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedItem(item);
                              setShowDeleteDialog(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )
      ) : (
        // Empty State
        <Card className="rounded-xl border-0 bg-gradient-to-br from-background to-muted/30">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="p-4 bg-primary/10 rounded-full mb-4">
              <Folder className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">No files found</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              {searchQuery ? 'No results match your search' : 'Start by uploading files or creating folders'}
            </p>
            {!searchQuery && (
              <div className="flex gap-2">
                <Button size="sm" className="rounded-lg gap-2" onClick={() => setShowNewFolderDialog(true)}>
                  <FolderPlus className="h-4 w-4" /> New Folder
                </Button>
                <Button size="sm" variant="outline" className="rounded-lg gap-2" onClick={() => setShowUploadDialog(true)}>
                  <Upload className="h-4 w-4" /> Upload
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* New Folder Dialog */}
      <Dialog open={showNewFolderDialog} onOpenChange={setShowNewFolderDialog}>
        <DialogContent className="rounded-xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className="rounded-lg"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewFolderDialog(false)} className="rounded-lg">
              Cancel
            </Button>
            <Button onClick={handleCreateFolder} className="rounded-lg">
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Dialog */}
      <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
        <DialogContent className="rounded-xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rename {selectedItem?.type}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="New name"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              className="rounded-lg"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRenameDialog(false)} className="rounded-lg">
              Cancel
            </Button>
            <Button onClick={handleRename} className="rounded-lg">
              Rename
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="rounded-xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete {selectedItem?.type}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground">
              Are you sure you want to delete "{selectedItem?.name}"? This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)} className="rounded-lg">
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} className="rounded-lg">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="rounded-xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Files</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {isUploading ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            ) : (
              <>
                <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileSelected} />
                <div 
                  className="border-2 border-dashed rounded-xl p-8 text-center hover:border-primary transition-colors cursor-pointer"
                  onClick={handleUploadClick}
                >
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm font-medium">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Support for images, videos, audio, PDFs
                  </p>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUploadDialog(false)} className="rounded-lg">
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}