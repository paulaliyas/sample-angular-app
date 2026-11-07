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

  @ViewChild('closeButton') closeButton!: ElementRef<HTMLButtonElement>;

  private readonly translate = inject(TranslateService);

  /** Follows the language toggle while the popup is open */
  get content(): TermsContent {
    return TERMS[currentLang(this.translate)];
  }

  /** Moves keyboard focus into the popup, so it isn't left on the page behind */
  ngAfterViewInit(): void {
    this.closeButton.nativeElement.focus();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close.emit();
  }
}
