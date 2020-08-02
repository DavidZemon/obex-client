import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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

  constructor(private readonly client: HttpClient) {
  }

  async ngOnInit(): Promise<void> {
    this.tree = await this.client.get('/api/tree').toPromise() as TreeEntry[];
  }
}
