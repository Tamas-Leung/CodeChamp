import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProblemComponent } from './problem/problem.component';
import { StartpageComponent } from './startpage/startpage.component';

const routes: Routes = [
  { path: '', component:  StartpageComponent},
  { path: 'Problem', component: ProblemComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
