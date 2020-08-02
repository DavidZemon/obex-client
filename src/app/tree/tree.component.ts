import { Component, Input, OnInit } from '@angular/core';
import { TreeEntry } from '../app.component';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
})
export class TreeComponent {
  @Input() tree: TreeEntry[];
}
