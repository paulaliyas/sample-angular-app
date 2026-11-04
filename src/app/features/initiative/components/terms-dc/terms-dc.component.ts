import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { TERMS_SECTIONS, TERMS_TITLE } from './terms.content';

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

  title = TERMS_TITLE;
  sections = TERMS_SECTIONS;

  /** Moves keyboard focus into the popup, so it isn't left on the page behind */
  ngAfterViewInit(): void {
    this.closeButton.nativeElement.focus();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close.emit();
  }
}
