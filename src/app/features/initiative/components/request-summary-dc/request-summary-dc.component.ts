import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { Establishment } from '../initiative.models';

/** Step 4 — review everything before submitting the request. */
@Component({
  selector: 'app-request-summary-dc',
  templateUrl: './request-summary-dc.component.html',
  styleUrls: ['./request-summary-dc.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class RequestSummaryDcComponent {
  @Input() establishment!: Establishment;
  @Input() strategyTitle = '';
  @Input() contributorCount = 0;
  @Input() maxCount = 0;
  @Input() eligibleCount = 0;
  @Input() totalBenefit = 0;
  /** A request is on its way — sending again is blocked */
  @Input() busy = false;

  @Output() edit = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();
  @Output() submitRequest = new EventEmitter<void>();

  /** The limit as a share of the eligible contributors */
  get maxPercent(): number {
    return this.eligibleCount ? (this.maxCount / this.eligibleCount) * 100 : 0;
  }
}
