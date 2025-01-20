export type NoteColor = 'default' | 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink';

export type NoteType = 'text' | 'list' | 'image';

export interface Note {
  id: string;
  title: string;
  content: string;
  type: NoteType;
  color: NoteColor;
  isPinned: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  labels: string[];
  imageUrl?: string;
  listItems?: { id: string; text: string; completed: boolean }[];
}