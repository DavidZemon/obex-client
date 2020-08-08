import {Component, Inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Clipboard} from '@angular/cdk/clipboard';
import {TreeEntry} from '../model/tree';

export interface PreviewDialogData {
  entry: TreeEntry;
  downloadUrl: string;
}

@Component({
  selector: 'app-preview-dialog',
  templateUrl: './preview-dialog.component.html'
})
export class PreviewDialogComponent {

  fileContent?: string;

  constructor(private readonly dialogRef: MatDialogRef<PreviewDialogComponent>,
              private readonly client: HttpClient,
              private readonly clipboard: Clipboard,
              @Inject(MAT_DIALOG_DATA) public readonly data: PreviewDialogData) {
    this.client.get<string>(
      this.data.downloadUrl,
      {responseType: 'text' as 'json'}
    ).toPromise().then((content) => {
      this.fileContent = content;
    });
  }

  onDismiss(): void {
    this.dialogRef.close();
  }

  copy(): void {
    this.clipboard.copy(this.fileContent);
  }
}
