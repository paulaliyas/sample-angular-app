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

  @Output() apply = new EventEmitter<void>();

  declarationAccepted = false;
  showTerms = false;

  @ViewChild('termsLink') termsLink!: ElementRef<HTMLButtonElement>;

  /** The link sits inside the checkbox label, so the click must not tick the box */
  openTerms(event: Event): void {
    event.preventDefault();
    this.showTerms = true;
  }

  closeTerms(): void {
    this.showTerms = false;
    // Back to where the user was, for keyboard and screen reader users
    this.termsLink.nativeElement.focus();
  }


  onApply(): void {
    if (this.declarationAccepted) {
      this.apply.emit();
    }
  }
}
