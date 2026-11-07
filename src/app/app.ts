import { DOCUMENT } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

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
  private readonly translate = inject(TranslateService);

  /** Switches the language and the page direction (LTR for English, RTL for Arabic) */
  setLang(lang: Lang): void {
    this.lang = lang;
    this.translate.use(lang);
    const html = this.doc.documentElement;
    html.lang = lang;
    html.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }
}
