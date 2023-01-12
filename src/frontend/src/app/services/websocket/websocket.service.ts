import { Injectable } from '@angular/core';
import { Route, Router } from '@angular/router';

import { AsyncSubject, BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { LobbyService } from '../lobby/lobby.service';
import { GameEvent } from './interfaces';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private websocket!: WebSocket;
  private address = 'ws://localhost:7070/ws';
  public newGameID = new BehaviorSubject<string>('');
  public gameJoined = new Subject<boolean>();
  public findGameID = new Subject();

  constructor(
    private lobbyService: LobbyService,
    private router: Router,
    private auth: AuthService
  ) {}

  public open() {
    this.websocket = new WebSocket(this.address);
    this.websocket.onopen = this.handleOnOpen;
    this.websocket.onmessage = (e) => this.handleMessage(e);
    this.websocket.onclose = this.handleOnClose;
  }

  private handleMessage(event: any) {
    const data = JSON.parse(event.data);
    console.log('Received data');
    console.log(data);
    switch (data.method) {
      case GameEvent.CREATE:
        this.lobbyService.updateCurrentRound(0);
        this.newGameID.next(data.gameID);
        return;
      case GameEvent.JOIN:
        this.lobbyService.updateCurrentRound(0);
        this.lobbyService.updateWaitingRoom(data.players);
        return;
      case GameEvent.NEXT_ROUND:
        this.lobbyService.updateCurrentRound(data.round);
        this.router.navigate(['/problems/' + data.problemID]);
        return;
      case GameEvent.FIND_GAME:
        this.findGameID.next(data.gameID);
        return;
      case GameEvent.PLAYERS_UPDATE:
        this.lobbyService.updateWaitingRoom(data.players);
        return;
      case GameEvent.END:
        this.lobbyService.updateCurrentRound(0);
        this.lobbyService.updateEndData(data.endData)
        return;
    }
  }

  findGame() {
    this.sendMessage(
      JSON.stringify({
        method: GameEvent.FIND_GAME,
        token: this.auth.getToken(),
      })
    );
  }

  createGame() {
    this.sendMessage(
      JSON.stringify({ method: GameEvent.CREATE, token: this.auth.getToken() })
    );
  }

  joinGame(gameID: string) {
    this.newGameID.next(gameID);
    this.sendMessage(
      JSON.stringify({
        method: GameEvent.JOIN,
        token: this.auth.getToken(),
        gameID,
      })
    );
  }

  nextRound() {
    if (this.newGameID.value) {
      this.sendMessage(
        JSON.stringify({
          method: GameEvent.NEXT_ROUND,
          gameID: this.newGameID.value,
        })
      );
    }
  }

  public sendMessage(message: string) {
    console.log('Send data: ');
    console.log(message);
    this.websocket.send(message);
  }

  public close() {
    this.websocket.close();
  }

  private handleOnOpen(event: any) {}

  private handleOnClose(event: any) {}
}
