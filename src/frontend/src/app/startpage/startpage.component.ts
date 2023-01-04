import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { WebSocketService } from '../services/websocket/websocket.service';

@Component({
  selector: 'app-startpage',
  templateUrl: './startpage.component.html',
  styleUrls: ['./startpage.component.scss'],
})
export class StartpageComponent {
  constructor(
    private auth: AuthService,
    private router: Router,
    private ws: WebSocketService
  ) {}

  ngOnInit() {
    this.ws.findGameID.subscribe((gameID) => {
      if (gameID === '') {
        console.log('No lobbies found.');
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

  findGame() {
    this.ws.findGame();
  }
}
