import {Component, Inject, OnInit} from '@angular/core';
import {NestedTreeControl} from '@angular/cdk/tree';
import {HttpClient} from '@angular/common/http';
import {APP_BASE_HREF} from '@angular/common';
import {MatDialog} from '@angular/material/dialog';
import {PreviewDialogComponent} from '../preview/preview-dialog.component';
import {EntryType, TreeEntry} from '../model/tree';


const sortTreeEntry = (lhs: TreeEntry, rhs: TreeEntry): number => {
  if (lhs.entry_type === rhs.entry_type || (lhs.entry_type !== EntryType.FOLDER && rhs.entry_type !== EntryType.FOLDER)) {
    return lhs.name.localeCompare(rhs.name);
  } else if (lhs.entry_type === EntryType.FOLDER) {
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
  readonly baseHref: string;
  tree: TreeEntry[] = [];

  readonly treeControl = new NestedTreeControl<TreeEntry>(node => node.children);

  private static sortTree(tree: TreeEntry[]): void {
    tree.sort(sortTreeEntry);
    tree.filter(e => e.entry_type === EntryType.FOLDER).forEach(e => TreeComponent.sortTree(e.children));
  }

  constructor(private readonly client: HttpClient,
              private readonly dialog: MatDialog,
              @Inject(APP_BASE_HREF) baseHref: string) {
    if (baseHref.endsWith('/')) {
      this.baseHref = baseHref;
    } else {
      this.baseHref = baseHref + '/';
    }
  }

  async ngOnInit(): Promise<void> {
    TreeComponent.sortTree(this.tree = await this.client.get<TreeEntry[]>('/api/tree/').toPromise());
  }

  hasChild(_: number, entry: TreeEntry): boolean {
    return !!entry.children;
  }

  getEncodedFullPath(entry: TreeEntry): string {
    return encodeURI(entry.full_path);
  }

  getDownloadPath(entry: TreeEntry): string {
    const suffix = entry.entry_type === EntryType.FOLDER ? '.zip' : '';
    return `/api/downloads/${(this.getEncodedFullPath(entry))}${suffix}`;
  }

  openPreview(entry): void {
    this.dialog.open(
      PreviewDialogComponent,
      {
        maxWidth: '90%',
        data: {
          downloadUrl: this.getDownloadPath(entry),
          entry
        }
      }
    );
  }
}
