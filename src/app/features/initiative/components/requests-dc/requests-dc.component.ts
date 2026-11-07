import { Component, Input, ViewEncapsulation } from '@angular/core';
import { InitiativeRequest, RequestLine, RequestStatus } from '../initiative.models';

/** Dashboard tab — every add / remove request and its contributors. */
@Component({
  selector: 'app-requests-dc',
  templateUrl: './requests-dc.component.html',
  styleUrls: ['./requests-dc.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class RequestsDcComponent {
  @Input() requests: InitiativeRequest[] = [];

  statuses: Record<RequestStatus, { label: string; css: string }> = {
    // label: translation key
    'under-review': { label: 'initiative.requests.status.under-review', css: 'status--warning' },
    approved: { label: 'initiative.requests.status.approved', css: 'status--success' },
    rejected: { label: 'initiative.requests.status.rejected', css: 'status--error' },
  };

  searchText = '';
  openIds: string[] = [];
  /** Search text inside each opened card, by transaction ID */
  lineSearch: Record<string, string> = {};

  /** A request matches by its transaction ID or any of its contributors */
  get filteredRequests(): InitiativeRequest[] {
    const text = this.searchText.trim().toLowerCase();
    return this.requests.filter((r) => r.transactionId.includes(text) || this.matchingLines(r.lines, text).length > 0);
  }

  isOpen(request: InitiativeRequest): boolean {
    return this.openIds.includes(request.transactionId);
  }

  toggle(request: InitiativeRequest): void {
    this.openIds = this.isOpen(request)
      ? this.openIds.filter((id) => id !== request.transactionId)
      : [...this.openIds, request.transactionId];
  }

  linesOf(request: InitiativeRequest): RequestLine[] {
    return this.matchingLines(request.lines, (this.lineSearch[request.transactionId] ?? '').trim().toLowerCase());
  }

  private matchingLines(lines: RequestLine[], text: string): RequestLine[] {
    return lines.filter((l) => l.contributor.name.toLowerCase().includes(text) || l.contributor.nnid.includes(text));
  }
}
