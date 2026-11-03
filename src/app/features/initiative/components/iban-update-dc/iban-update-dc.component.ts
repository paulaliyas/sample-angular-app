import { Component, Input, ViewEncapsulation } from '@angular/core';
import { IbanUpdate } from '../initiative.models';
import { matchesSearch, memoize } from '../list-utils';

/** Dashboard tab — IBANs that were added or changed, waiting to be validated. */
@Component({
  selector: 'app-iban-update-dc',
  templateUrl: './iban-update-dc.component.html',
  styleUrls: ['./iban-update-dc.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class IbanUpdateDcComponent {
  @Input() updates: IbanUpdate[] = [];

  searchText = '';
  pageSize = 10;
  page = 1;

  get filteredUpdates(): IbanUpdate[] {
    return this.filter(this.updates, this.searchText);
  }

  // Cached: this getter runs on every change detection, and lists can be thousands of rows
  private filter = memoize((updates: IbanUpdate[], search: string) => {
    const text = search.trim().toLowerCase();
    return updates.filter((u) => matchesSearch(u.contributor, text));
  });

  get pagedUpdates(): IbanUpdate[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredUpdates.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredUpdates.length / this.pageSize));
  }

  onSearch(): void {
    this.page = 1;
  }
}
