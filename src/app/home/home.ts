import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  template: `
    <h2>Welcome</h2>
    <p>This is a sample Angular app with a lazy-loaded feature module.</p>
    <p>Counter: <strong>{{ count }}</strong></p>
    <button (click)="count = count - 1">−</button>
    <button (click)="count = count + 1">+</button>
  `,
  styles: `:host { display: block; max-width: 640px; margin: 0 auto; }
  button { font-size: 1rem; padding: 0.25rem 0.75rem; margin-right: 0.5rem; }`,
})
export class Home {
  count = 0;
}
