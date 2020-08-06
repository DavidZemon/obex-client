import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {PreviewComponent} from './preview/preview.component';

const routes: Routes = [
  {
    path: 'tree',
    component: HomeComponent
  },
  {
    path: 'preview/:path',
    pathMatch: 'prefix',
    component: PreviewComponent,
    children: [
      {
        path: '**',
        component: PreviewComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/tree'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
