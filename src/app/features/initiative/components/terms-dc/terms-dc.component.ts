import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Output, ViewChild, ViewEncapsulation, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { currentLang } from '../i18n/initiative-translations';
import { TERMS, TermsContent } from './terms.content';

/** Terms & Conditions popup, opened from the declaration on the Apply step. */
@Component({
  selector: 'app-terms-dc',
  templateUrl: './terms-dc.component.html',
  styleUrls: ['./terms-dc.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class TermsDcComponent implements AfterViewInit {
  @Output() close = new EventEmitter<void>();
  /** The user has scrolled to the bottom of the text (also when it fits without scrolling) */
  @Output() readToEnd = new EventEmitter<void>();

  @ViewChild('closeButton') closeButton!: ElementRef<HTMLButtonElement>;
  @ViewChild('body') body!: ElementRef<HTMLElement>;

  private readonly translate = inject(TranslateService);

  /** Follows the language toggle while the popup is open */
  get content(): TermsContent {
    return TERMS[currentLang(this.translate)];
  }

  /** Moves keyboard focus into the popup, so it isn't left on the page behind */
  ngAfterViewInit(): void {
    this.closeButton.nativeElement.focus();
    // Large screens may show the whole text at once; wait a tick so the parent isn't changed mid-check
    Promise.resolve().then(() => this.checkEnd());
  }

  /** Bottom reached (a few px of slack for zoom and rounding) */
  checkEnd(): void {
    const el = this.body.nativeElement;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 4) {
      this.readToEnd.emit();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close.emit();
  }
}
