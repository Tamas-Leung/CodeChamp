import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
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
    public ws: WebSocketService
  ) {}

  joinGameFormControl = new FormControl('', Validators.required);

  ngOnInit() {
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
