import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
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


  onApply(): void {
    if (this.declarationAccepted) {
      this.apply.emit();
    }
  }
}
