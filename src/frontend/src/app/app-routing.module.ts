import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProblemComponent } from './problem/problem.component';
import { ProblemsComponent } from './problems/problems.component';

const routes: Routes = [
  { path: '', component: ProblemsComponent },
  { path: 'problem/:id', component: ProblemComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
