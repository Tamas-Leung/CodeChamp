import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-startpage',
  templateUrl: './startpage.component.html',
  styleUrls: ['./startpage.component.scss'],
})
export class StartpageComponent {
  constructor(private auth: AuthService, private router: Router) {}

  onLogout() {
    this.auth.logout();
  }
}
