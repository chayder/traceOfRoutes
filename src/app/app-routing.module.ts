import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LocalRouteComponent } from './components/local-route/local-route.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'local-route', component: LocalRouteComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
