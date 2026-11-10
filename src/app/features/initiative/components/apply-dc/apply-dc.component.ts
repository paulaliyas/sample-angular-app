import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { Establishment, Faq } from '../initiative.models';

/** Step 1 — eligibility, FAQ and the declaration. */
@Component({
  selector: 'app-apply-dc',
  templateUrl: './apply-dc.component.html',
  styleUrls: ['./apply-dc.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class ApplyDcComponent {
  @Input() establishment!: Establishment;
  @Input() faqs: Faq[] = [];
  /** The terms were scrolled to the end — kept by the parent for the session, so coming back doesn't reset it */
  @Input() termsRead = false;

  @Output() apply = new EventEmitter<void>();
  @Output() termsReadChange = new EventEmitter<boolean>();

  declarationAccepted = false;
  showTerms = false;

  /** FAQ pagination: 8 questions a page, as in the design */
  // TODO: if the API returns the FAQs page by page, request each page instead of slicing here
  faqPageSize = 8;
  faqPage = 1;

  get faqTotalPages(): number {
    return Math.max(1, Math.ceil(this.faqs.length / this.faqPageSize));
  }

  get pagedFaqs(): Faq[] {
    const start = (this.faqPage - 1) * this.faqPageSize;
    return this.faqs.slice(start, start + this.faqPageSize);
  }

  /** A new page gets fresh (closed) accordions instead of reusing the open ones */
  trackFaq(_index: number, faq: Faq): string {
    return faq.question;
  }

  @ViewChild('termsLink') termsLink!: ElementRef<HTMLButtonElement>;

  /** The link sits inside the checkbox label, so the click must not tick the box */
  openTerms(event: Event): void {
    event.preventDefault();
    this.showTerms = true;
  }

  /** Reaching the end of the terms enables the checkbox; it stays enabled after that */
  onTermsReadToEnd(): void {
    if (!this.termsRead) {
      this.termsRead = true;
      this.termsReadChange.emit(true);
    }
  }

  closeTerms(): void {
    this.showTerms = false;
    // Back to where the user was, for keyboard and screen reader users
    this.termsLink.nativeElement.focus();
  }


  onApply(): void {
    if (this.termsRead && this.declarationAccepted) {
      this.apply.emit();
    }
  }
}
