import { Component, Input, ViewEncapsulation } from '@angular/core';
import { IbanUpdate } from '../initiative.models';

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
    const text = this.searchText.trim().toLowerCase();
    return this.updates.filter((u) => u.contributor.name.toLowerCase().includes(text) || u.contributor.nnid.includes(text));
  }

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
