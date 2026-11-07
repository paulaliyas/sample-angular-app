import { Component, EventEmitter, Input, Output, ViewEncapsulation, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { InitiativeMember } from '../initiative.models';
import { idSet, matchesSearch, memoize } from '../list-utils';

/** Dashboard tab — the contributors in the initiative; select to remove, or add more up to the limit. */
@Component({
  selector: 'app-manage-contributors-dc',
  templateUrl: './manage-contributors-dc.component.html',
  styleUrls: ['./manage-contributors-dc.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class ManageContributorsDcComponent {
  private readonly translate = inject(TranslateService);

  @Input() members: InitiativeMember[] = [];
  @Input() maxCount = 0;
  /** A request is on its way — sending again is blocked */
  @Input() busy = false;

  @Output() add = new EventEmitter<void>();
  @Output() remove = new EventEmitter<InitiativeMember[]>();

  searchText = '';
  pageSize = 10;
  page = 1;
  selectedIds: string[] = [];

  get limitReached(): boolean {
    return this.members.length >= this.maxCount;
  }

  get filteredMembers(): InitiativeMember[] {
    return this.filter(this.members, this.searchText);
  }

  // Cached: these getters run on every change detection, and lists can be thousands of rows
  private selectedSet = idSet();
  private filter = memoize((members: InitiativeMember[], search: string) => {
    const text = search.trim().toLowerCase();
    return members.filter((m) => matchesSearch(m, text));
  });

  get pagedMembers(): InitiativeMember[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredMembers.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredMembers.length / this.pageSize));
  }

  get allPageSelected(): boolean {
    return this.pagedMembers.length > 0 && this.pagedMembers.every((m) => this.isSelected(m));
  }

  onSearch(): void {
    this.page = 1;
  }

  isSelected(member: InitiativeMember): boolean {
    return this.selectedSet(this.selectedIds).has(member.nnid);
  }

  toggle(member: InitiativeMember): void {
    this.selectedIds = this.isSelected(member)
      ? this.selectedIds.filter((id) => id !== member.nnid)
      : [...this.selectedIds, member.nnid];
  }

  /** The header checkbox ticks / unticks the rows on this page */
  toggleAll(): void {
    const pageIds = this.pagedMembers.map((m) => m.nnid);
    this.selectedIds = this.allPageSelected
      ? this.selectedIds.filter((id) => !pageIds.includes(id))
      : [...new Set([...this.selectedIds, ...pageIds])];
  }

  deselectAll(): void {
    this.selectedIds = [];
  }

  onRemove(): void {
    this.remove.emit(this.members.filter((m) => this.isSelected(m)));
    this.selectedIds = [];
    this.page = 1;
  }

  // TODO: swap for the API's export once there is one
  downloadList(): void {
    // Column names in the current language
    const header = [
      'manage.csv.name', 'manage.csv.idNo', 'common.requestId', 'common.joiningDate',
      'manage.csv.benefit', 'manage.csv.benefitStart', 'manage.csv.benefitEnd', 'common.iban',
    ].map((key) => this.translate.instant(`initiative.${key}`) as string);
    const notAvailable = this.translate.instant('initiative.common.notAvailable') as string;
    const rows = this.members.map((m) => [m.name, m.nnid, m.requestId, m.joiningDate, m.benefitAmount.toFixed(2), m.benefitStart, m.benefitEnd, m.maskedIban ?? notAvailable]);
    const csv = [header, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');

    const link = document.createElement('a');
    // The BOM makes Excel read the Arabic text as UTF-8
    link.href = URL.createObjectURL(new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' }));
    link.download = 'initiative-contributors.csv';
    link.click();
    URL.revokeObjectURL(link.href);
  }
}
