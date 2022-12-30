import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { LobbyService } from '../lobby/lobby.service';
import { GameEvent } from './interfaces';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private websocket!: WebSocket;
  private address = 'ws://localhost:7070/ws';
  public newGameID = new BehaviorSubject<string>('Creating new game...');
  public gameJoined = new Subject<boolean>();

  constructor(private lobbyService: LobbyService) {}

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
    }
  }

  createGame() {
    this.sendMessage(JSON.stringify({ method: GameEvent.CREATE }));
  }

  joinGame(gameID: string) {
    this.sendMessage(JSON.stringify({ method: GameEvent.JOIN, gameID }));
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
