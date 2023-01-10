import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LobbyService } from '../services/lobby/lobby.service';
import { WebSocketService } from '../services/websocket/websocket.service';
import { PlayerData } from '../types/PlayerData';
import { Location } from '@angular/common';
import { Clipboard } from '@angular/cdk/clipboard';

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
    private router: Router
  ) {}

  ngOnInit(): void {
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
    this.clipboard.copy(this.id);
  }

  leave() {
    this.ws.close();
    this.ws.open();
    this.router.navigate(['/']);
  }
}
