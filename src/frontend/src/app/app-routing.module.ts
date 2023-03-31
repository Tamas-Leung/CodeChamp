
/* 
 * CodeChamp Copyright (C) 2023 Tamas Leung, Anton Kanugalawattage, Zhiming Zhao, Youssef Rizkalla, Dipendra Subedi 
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

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
