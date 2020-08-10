export enum EntryType {
  FILE = 'FILE',
  FOLDER = 'FOLDER',
  SYMLINK = 'SYMLINK'
}

export interface TreeEntry {
  name: string;
  full_path: string;
  entry_type: EntryType;
  parent_listing: TreeEntry[] | null;
  current_listing: TreeEntry[];
  size?: number;
  children?: TreeEntry[];
  target?: string;
}
