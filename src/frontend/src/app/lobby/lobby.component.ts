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
import { ActivatedRoute, Router } from '@angular/router';
import { LobbyService } from '../services/lobby/lobby.service';
import { WebSocketService } from '../services/websocket/websocket.service';
import { PlayerData } from '../types/PlayerData';
import { Location } from '@angular/common';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss'],
})
export class LobbyComponent implements OnInit {
  id: string = '';
  players: PlayerData[] = [];
  numOfPlayers = 0;

  constructor(
    private aRoute: ActivatedRoute,
    private ws: WebSocketService,
    private lobbyService: LobbyService,
    private location: Location,
    private clipboard: Clipboard,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    //Workaround to disable back button in a way
    history.pushState(null, '', location.href);
    window.onpopstate = function () {
      history.go(1);
    };

    this.lobbyService.waitingRoom.subscribe((players) => {
      this.players = players;
      this.numOfPlayers = this.players.length;
    });

    const id = this.aRoute.snapshot.paramMap.get('id');
    if (id) {
      this.id = id;
      setTimeout(() => {
        this.ws.joinGame(id);
      }, 500);
    } else {
      this.ws.newGameID.subscribe((id) => {
        this.location.replaceState('/lobby/' + id);
        this.id = id;
      });
    }
  }

  startGame() {
    this.ws.nextRound();
  }

  copyCode() {
    this.clipboard.copy(window.location.href);
    this.snackBar.open('Lobby Link copied!', 'Ok', { duration: 2000 });
  }

  leave() {
    this.ws.leaveGame();
    this.router.navigate(['/']);
  }
}
