import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
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
    private auth: AuthService,
    private snackBar: MatSnackBar
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
        this.lobbyService.updateEndData(data.endData);
        return;
      case GameEvent.DISCONNECT:
        this.router.navigate(['/']);
        this.snackBar.open(data.message, 'OK');
        return;
      case GameEvent.RECONNECT:
        this.lobbyService.updateCurrentRound(data.round);
        this.router.navigate(['/problems/' + data.problemID]);
        this.snackBar.open('Reconnected', 'OK');
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

  reconnectToGame() {
    this.sendMessage(
      JSON.stringify({
        method: GameEvent.RECONNECT,
        token: this.auth.getToken(),
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

  leaveGame() {
    this.sendMessage(
      JSON.stringify({
        method: GameEvent.LEAVE_GAME,
        token: this.auth.getToken(),
      })
    );
  }

  public sendMessage(message: string) {
    console.log('Send data: ');
    console.log(message);
    this.waitForConnection(() => {
      this.websocket.send(message);
    }, 1000);
  }

  waitForConnection(callback: Function, interval: number) {
    if (this.websocket.readyState === 1) {
      callback();
    } else {
      var that = this;
      // optional: implement backoff for interval here
      setTimeout(function () {
        that.waitForConnection(callback, interval);
      }, interval);
    }
  }

  public close() {
    this.websocket.close();
  }

  private handleOnOpen(event: any) {}

  private handleOnClose(event: any) {}
}
