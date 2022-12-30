import { Component } from '@angular/core';
import { WebSocketService } from './services/websocket/websocket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'code-champ';

  constructor(private ws: WebSocketService) {
    this.ws.open();
  }
}
