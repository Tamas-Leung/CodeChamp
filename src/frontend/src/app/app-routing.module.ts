import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProblemComponent } from './problem/problem.component';
import { ProblemsComponent } from './problems/problems.component';
import { StartpageComponent } from './startpage/startpage.component';

const routes: Routes = [
  { path: '', component: StartpageComponent },
  { path: 'problems', component: ProblemsComponent },
  { path: 'problems/:id', component: ProblemComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
