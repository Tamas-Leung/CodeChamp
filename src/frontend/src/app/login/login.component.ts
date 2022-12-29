import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CredentialResponse } from 'google-one-tap';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(
    private service: AuthService,
    private router: Router,
    private zone: NgZone
  ) {}

  ngOnInit(): void {
    // @ts-ignore
    window.onGoogleLibraryLoad = () => {
      // @ts-ignore
      google.accounts.id.initialize({
        // Ref: https://developers.google.com/identity/gsi/web/reference/js-reference#IdConfiguration
        client_id:
          '1049277800628-djvnt32n0odf07kqelkn1t0iee33kk0n.apps.googleusercontent.com',
        callback: this.handleCredentialResponse.bind(this), // Whatever function you want to trigger...
        auto_select: false,
        cancel_on_tap_outside: false,
      });

      // @ts-ignore
      // google.accounts.id.prompt((notification: PromptMomentNotification) => {});

      // @ts-ignore
      google.accounts.id.renderButton(
        // @ts-ignore
        document.getElementById('buttonDiv'),
        { theme: 'outline', size: 'large', width: '100%' }
      );
    };
  }

  async handleCredentialResponse(response: CredentialResponse) {
    await this.service.login(response.credential).subscribe({
      next: (x: any) => {
        localStorage.setItem('token', response.credential);
        this.zone.run(() => {
          this.router.navigate(['/']);
        });
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }
}
