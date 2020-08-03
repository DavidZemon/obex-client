import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NestedTreeControl} from '@angular/cdk/tree';

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
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title = 'Parallax OBEX';

  tree: TreeEntry[] = [];

  treeControl = new NestedTreeControl<TreeEntry>(node => node.children);

  private static sortTree(tree: TreeEntry[]): void {
    tree.sort(sortTreeEntry);
    tree.filter(e => e.type === EntryType.FOLDER).forEach(e => AppComponent.sortTree(e.children));
  }

  constructor(private readonly client: HttpClient) {
  }

  async ngOnInit(): Promise<void> {
    this.tree = await this.client.get('/api/tree').toPromise() as TreeEntry[];
    AppComponent.sortTree(this.tree);
  }

  hasChild(_: number, entry: TreeEntry): boolean {
    return !!entry.children;
  }

  getDownloadPath(entry: TreeEntry): string {
    const suffix = entry.type === EntryType.FOLDER ? '.zip' : '';
    const urlEncodedPath = encodeURI(entry.fullPath);
    return `/api/downloads/${urlEncodedPath}${suffix}`;
  }
}
