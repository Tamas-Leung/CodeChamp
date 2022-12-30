import { Injectable } from '@angular/core';
import { Route, Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
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

  constructor(private lobbyService: LobbyService, private router: Router) {}

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
        this.newGameID.next(data.gameID);
        return;
      case GameEvent.JOIN:
        this.lobbyService.updateWaitingRoom(data.players);
        return;
      case GameEvent.NEXT_ROUND:
        this.router.navigate(['/problems/' + data.problemID]);
    }
  }

  createGame() {
    this.sendMessage(JSON.stringify({ method: GameEvent.CREATE }));
  }

  joinGame(gameID: string) {
    this.newGameID.next(gameID);
    this.sendMessage(JSON.stringify({ method: GameEvent.JOIN, gameID }));
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
