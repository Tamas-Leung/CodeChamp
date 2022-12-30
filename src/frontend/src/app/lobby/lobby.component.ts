import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LobbyService } from '../services/lobby/lobby.service';
import { WebSocketService } from '../services/websocket/websocket.service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss'],
})
export class LobbyComponent implements OnInit {
  id: string = '';
  players: string[] = [];

  constructor(
    private aRoute: ActivatedRoute,
    private ws: WebSocketService,
    private lobbyService: LobbyService
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
        this.id = id;
      });
    }
  }
}
