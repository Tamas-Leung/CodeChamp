import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProblemComponent } from './problem/problem.component';
import { ProblemsComponent } from './problems/problems.component';
import { StartpageComponent } from './startpage/startpage.component';
import { LoginComponent } from './login/login.component';
import { AuthGuardService } from './services/auth-guard/auth-guard.service';
import { LobbyComponent } from './lobby/lobby.component';
import { MyProfileComponent } from './myprofile/myprofile.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { EndComponent } from './end/end.component';

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

  {
    path: 'profile',
    component: MyProfileComponent,
    canActivate: [AuthGuardService],
  },

  {
    path: 'leaderboard',
    component: LeaderboardComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'end',
    component: EndComponent,
    canActivate: [AuthGuardService],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
