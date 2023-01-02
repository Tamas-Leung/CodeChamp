import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LobbyService } from '../services/lobby/lobby.service';
import { WebSocketService } from '../services/websocket/websocket.service';
import { PlayerData } from '../types';
import { Location } from '@angular/common';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss'],
})
export class LobbyComponent implements OnInit {
  id: string = '';
  players: PlayerData[] = [];

  constructor(
    private aRoute: ActivatedRoute,
    private ws: WebSocketService,
    private lobbyService: LobbyService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.lobbyService.waitingRoom.subscribe((players) => {
      this.players = players;
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
}
