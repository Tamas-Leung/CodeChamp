import { Component, OnInit } from '@angular/core';
import { PlayerData } from '../types/PlayerData';
import { Router } from '@angular/router';

@Component({
  selector: 'app-myprofile',
  templateUrl: './myprofile.component.html',
  styleUrls: ['./myprofile.component.scss']
})
export class MyprofileComponent {
  id: string = '';
  players: PlayerData[] = [];

  constructor(
    private router: Router,
  ) {}

  leave() {
    this.router.navigate(['/']);
  }
}
