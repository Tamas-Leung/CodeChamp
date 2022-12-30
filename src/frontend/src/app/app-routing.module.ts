import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProblemComponent } from './problem/problem.component';
import { ProblemsComponent } from './problems/problems.component';
import { StartpageComponent } from './startpage/startpage.component';
import { LoginComponent } from './login/login.component';
import { AuthGuardService } from './services/auth-guard/auth-guard.service';
import { LobbyComponent } from './lobby/lobby.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: StartpageComponent, canActivate: [AuthGuardService] },
  {
    path: 'problems',
    component: ProblemsComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'problems/:id',
    component: ProblemComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'lobby',
    component: LobbyComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'lobby/:id',
    component: LobbyComponent,
    canActivate: [AuthGuardService],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
