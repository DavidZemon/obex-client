import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';

const routes: Routes = [
  {
    path: 'tree' /* /:path */,
    component: HomeComponent/*,
    children: [
      {
        path: '**',
        component: HomeComponent
      }
    ]*/
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
