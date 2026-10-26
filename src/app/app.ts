import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  selector: 'app-root',
  styleUrls: ['./app.scss'],
  templateUrl: './app.html',
})
export class App {
  title = 'sample-angular-app';
}
