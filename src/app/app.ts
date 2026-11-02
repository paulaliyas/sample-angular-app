import { DOCUMENT } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

type Lang = 'en' | 'ar';

@Component({
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  selector: 'app-root',
  styleUrls: ['./app.scss'],
  templateUrl: './app.html',
})
export class App {
  title = 'sample-angular-app';
  lang: Lang = 'en';

  private readonly doc = inject(DOCUMENT);

  /** Switches the page direction only (LTR for English, RTL for Arabic); no text is translated. */
  setLang(lang: Lang): void {
    this.lang = lang;
    const html = this.doc.documentElement;
    html.lang = lang;
    html.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }
}
