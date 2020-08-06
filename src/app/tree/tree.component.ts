import {Component, OnInit} from '@angular/core';
import {NestedTreeControl} from '@angular/cdk/tree';
import {HttpClient} from '@angular/common/http';

export enum EntryType {
  FILE = 'FILE',
  FOLDER = 'FOLDER',
  SYMLINK = 'SYMLINK'
}

export interface TreeEntry {
  name: string;
  fullPath: string;
  type: EntryType;
  size?: number;
  children?: TreeEntry[];
  target?: string;
}


const sortTreeEntry = (lhs: TreeEntry, rhs: TreeEntry): number => {
  if (lhs.type === rhs.type || (lhs.type !== EntryType.FOLDER && rhs.type !== EntryType.FOLDER)) {
    return lhs.name.localeCompare(rhs.name);
  } else if (lhs.type === EntryType.FOLDER) {
    return -1;
  } else {
    return 1;
  }
};

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html'
})
export class TreeComponent implements OnInit {
  tree: TreeEntry[] = [];

  readonly treeControl = new NestedTreeControl<TreeEntry>(node => node.children);

  private static sortTree(tree: TreeEntry[]): void {
    tree.sort(sortTreeEntry);
    tree.filter(e => e.type === EntryType.FOLDER).forEach(e => TreeComponent.sortTree(e.children));
  }

  constructor(private readonly client: HttpClient) {
  }

  async ngOnInit(): Promise<void> {
    TreeComponent.sortTree(this.tree = await this.client.get<TreeEntry[]>('/api/tree').toPromise());
  }

  hasChild(_: number, entry: TreeEntry): boolean {
    return !!entry.children;
  }

  getEncodedFullPath(entry: TreeEntry): string {
    return encodeURI(entry.fullPath);
  }

  getDownloadPath(entry: TreeEntry): string {
    const suffix = entry.type === EntryType.FOLDER ? '.zip' : '';
    return `/api/downloads/${(this.getEncodedFullPath(entry))}${suffix}`;
  }

}
