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

  contentType?: string;
  fileContent?: string | ArrayBuffer;

  constructor(private readonly dialogRef: MatDialogRef<PreviewDialogComponent>,
              private readonly client: HttpClient,
              private readonly clipboard: Clipboard,
              @Inject(MAT_DIALOG_DATA) public readonly data: PreviewDialogData) {
    this.client.get<Blob>(
      this.data.downloadUrl,
      {
        responseType: 'blob' as 'json',
        observe: 'response'
      }
    ).toPromise().then((response) => {
      this.contentType = response.headers.get('Content-Type');
      if (this.contentType.startsWith('text/')) {
        response.body.text().then((t) => this.fileContent = t);
      } else {
        const reader = new FileReader();
        reader.onload = (e) => this.fileContent = e.target.result;
        reader.readAsDataURL(response.body);
      }
    });
  }

  onDismiss(): void {
    this.dialogRef.close();
  }

  copy(): void {
    this.clipboard.copy(this.fileContent);
  }
}
