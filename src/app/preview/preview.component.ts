import {AfterViewInit, Component} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html'
})
export class PreviewComponent implements AfterViewInit {
  fileContent?: string;

  constructor(private readonly router: Router,
              private readonly client: HttpClient) {
  }

  async ngAfterViewInit(): Promise<void> {
    this.fileContent = await this.client.get<string>(
      `/api/downloads${this.router.url.slice('/preview'.length)}`,
      {responseType: 'text' as 'json'}
    ).toPromise();
  }
}
