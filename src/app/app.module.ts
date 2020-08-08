import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {MatExpansionModule} from '@angular/material/expansion';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatTreeModule} from '@angular/material/tree';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {TreeComponent} from './tree/tree.component';
import {HomeComponent} from './home/home.component';
import {RouterModule} from '@angular/router';
import {AppRoutingModule} from './app-routing.module';
import {HIGHLIGHT_OPTIONS, HighlightModule} from 'ngx-highlightjs';
import {APP_BASE_HREF, PlatformLocation} from '@angular/common';
import {MatDialogModule} from '@angular/material/dialog';
import {PreviewDialogComponent} from './preview/preview-dialog.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatToolbarModule} from '@angular/material/toolbar';
import {PdfViewerModule} from 'ng2-pdf-viewer';

// noinspection JSUnusedGlobalSymbols
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PreviewDialogComponent,
    TreeComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    HighlightModule,
    HttpClientModule,
    MatButtonModule,
    MatDialogModule,
    MatExpansionModule,
    MatIconModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    PdfViewerModule,
    RouterModule,
  ],
  providers: [
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
        fullLibraryLoader: () => import('highlight.js'),
      }
    },
    {
      provide: APP_BASE_HREF,
      useFactory: (pl: PlatformLocation) => pl.getBaseHrefFromDOM(),
      deps: [PlatformLocation]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
