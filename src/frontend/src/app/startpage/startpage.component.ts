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

import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { LobbyService } from '../services/lobby/lobby.service';
import { WebSocketService } from '../services/websocket/websocket.service';

@Component({
  selector: 'app-startpage',
  templateUrl: './startpage.component.html',
  styleUrls: ['./startpage.component.scss'],
})
export class StartpageComponent implements OnInit {
  constructor(
    private auth: AuthService,
    private router: Router,
    public ws: WebSocketService,
    private lobbyService: LobbyService
  ) {}

  joinGameFormControl = new FormControl('', Validators.required);

  ngOnInit() {
    this.lobbyService.updateEndData(undefined);

    this.ws.findGameID.subscribe((gameID) => {
      if (gameID === '') {
        this.createGame();
      } else {
        this.router.navigate(['/lobby/' + gameID]);
      }
    });
  }

  onLogout() {
    this.auth.logout();
  }

  createGame() {
    this.ws.createGame();
    this.router.navigate(['/lobby']);
  }

  joinGame() {
    if (this.joinGameFormControl.valid) {
      this.router.navigate(['/lobby/' + this.joinGameFormControl.value]);
    }
  }

  gotoProfile() {
    this.router.navigate(['/profile']);
  }

  gotoLeaderboard() {
    this.router.navigate(['/leaderboard']);
  }
}
