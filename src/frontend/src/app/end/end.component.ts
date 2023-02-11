import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LobbyService } from '../services/lobby/lobby.service';
import { EndData } from 'src/app/types/EndData';

@Component({
  selector: 'app-end',
  templateUrl: './end.component.html',
  styleUrls: ['./end.component.scss'],
})
export class EndComponent implements OnInit {
  endData: EndData;

  constructor(private router: Router, private lobbyService: LobbyService) {
    this.endData = { won: true };
  }

  ngOnInit(): void {
    this.lobbyService.endData.subscribe((endData) => {
      if (endData) {
        this.endData = endData;
      } else {
        this.router.navigate(['/']);
      }
    });
  }

  onHomeClick() {
    this.router.navigate(['/']);
  }
}
