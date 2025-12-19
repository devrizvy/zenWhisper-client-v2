export interface Note {
  id: string;
  title: string;
  content: string;
  folderId?: string;
  tags: string[];
  isPinned: boolean;
  isArchived: boolean;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Folder {
  id: string;
  name: string;
  color: string;
  icon?: string;
  createdAt: string;
  noteCount: number;
}

export interface CreateNoteRequest {
  title: string;
  content: string;
  folderId?: string | null;
  tags?: string[];
  isPinned?: boolean;
  isArchived?: boolean;
  color?: string | null;
}

export interface UpdateNoteRequest {
  title?: string;
  content?: string;
  folderId?: string;
  tags?: string[];
  isPinned?: boolean;
  isArchived?: boolean;
  color?: string;
}

export interface CreateFolderRequest {
  name: string;
  color: string;
  icon?: string;
}

export interface NotesResponse {
  notes: Note[];
  folders: Folder[];
  total: number;
}