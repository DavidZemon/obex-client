export enum EntryType {
  FILE = 'FILE',
  FOLDER = 'FOLDER',
  SYMLINK = 'SYMLINK'
}

export interface TreeEntry {
  name: string;
  full_path: string;
  entry_type: EntryType;
  size?: number;
  children?: TreeEntry[];
  target?: string;
}
