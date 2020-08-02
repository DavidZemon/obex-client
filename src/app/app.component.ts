import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {NestedTreeControl} from '@angular/cdk/tree';

export enum EntryType {
  FILE = 'FILE',
  FOLDER = 'FOLDER',
  SYMLINK = 'SYMLINK'
}

export interface TreeEntry {
  name: string;
  type: EntryType;
  size?: number;
  children?: TreeEntry[];
  target?: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit{
  title = 'Parallax OBEX';

  tree: TreeEntry[] = [];

  treeControl = new NestedTreeControl<TreeEntry>(node => node.children);

  constructor(private readonly client: HttpClient) {
  }

  async ngOnInit(): Promise<void> {
    this.tree = await this.client.get('/api/tree').toPromise() as TreeEntry[];
  }

  hasChild(_: number, entry: TreeEntry): boolean {
    return !!entry.children;
  }
}
