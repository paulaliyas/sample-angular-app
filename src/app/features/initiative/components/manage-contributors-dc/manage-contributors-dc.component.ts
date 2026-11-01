import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { InitiativeMember } from '../initiative.models';

/** Dashboard tab — the contributors in the initiative; select to remove, or add more up to the limit. */
@Component({
  selector: 'app-manage-contributors-dc',
  templateUrl: './manage-contributors-dc.component.html',
  styleUrls: ['./manage-contributors-dc.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class ManageContributorsDcComponent {
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
    const text = this.searchText.trim().toLowerCase();
    return this.members.filter((m) => m.name.toLowerCase().includes(text) || m.nnid.includes(text));
  }

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
    return this.selectedIds.includes(member.nnid);
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
    const header = ['Name', 'ID No', 'Request ID', 'Joining Date', 'Benefit (SAR)', 'Benefit Start', 'Benefit End', 'IBAN'];
    const rows = this.members.map((m) => [m.name, m.nnid, m.requestId, m.joiningDate, m.benefitAmount.toFixed(2), m.benefitStart, m.benefitEnd, m.maskedIban ?? 'N/A']);
    const csv = [header, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');

    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    link.download = 'initiative-contributors.csv';
    link.click();
    URL.revokeObjectURL(link.href);
  }
}
