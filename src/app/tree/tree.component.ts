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

const getSymlinkChildren = (link: TreeEntry): TreeEntry[] | null => {
  const targetParts = link.target.split('/');
  let nextList: TreeEntry[] = link.current_listing;
  for (const part of targetParts) {
    if ('..' === part) {
      nextList = nextList[0].parent_listing;
    } else if ('.' !== part) {
      nextList = nextList.find((e) => e.name === part)?.children;
    }

    if (!nextList) {
      return null;
    }
  }
  link.children = nextList;
  return link.children;
};

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html'
})
export class TreeComponent implements OnInit {
  readonly baseHref: string;
  tree: TreeEntry[] = [];

  readonly treeControl;

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

    this.treeControl = new NestedTreeControl<TreeEntry>((node) => {
      if (null === node.children && node.entry_type === 'FOLDER') {
        const observable = this.client.get<TreeEntry[]>(
          '/api/tree/',
          {
            params: {
              depth: '1',
              root: this.getEncodedFullPath(node)
            }
          }
        );
        observable.subscribe(children => node.children = children);
        return observable;
      } else {
        return node.children;
      }
    });
  }

  ngOnInit(): void {
    this.client.get<TreeEntry[]>(
      '/api/tree/',
      {params: {/* depth: '1'} */}},
    ).forEach((tree) => {
      TreeComponent.sortTree(this.tree = tree);
      const fleshOutCurrentAndParent = (directoryEntries: TreeEntry[], parent: TreeEntry[] | null) => {
        directoryEntries.forEach(e => {
          if ('FOLDER' === e.entry_type) {
            fleshOutCurrentAndParent(e.children, directoryEntries);
          }
          e.parent_listing = parent;
          e.current_listing = directoryEntries;
        });
      };
      fleshOutCurrentAndParent(this.tree, null);
    }).catch((e) => console.error(e));
  }

  hasChild(_: number, entry: TreeEntry): boolean {
    if (entry.entry_type === 'FOLDER') {
      return true;
    } else if (entry.entry_type === 'SYMLINK') {
      return getSymlinkChildren(entry) !== null;
    } else {
      return false;
    }
  }

  getEncodedFullPath(entry: TreeEntry): string {
    return encodeURI(entry.full_path);
  }

  getDownloadPath(entry: TreeEntry): string {
    const suffix = this.hasChild(null, entry) ? '.zip' : '';
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
