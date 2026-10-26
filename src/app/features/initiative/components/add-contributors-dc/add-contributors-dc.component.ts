import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Contributor } from '../initiative.models';

@Component({
  selector: 'app-add-contributors-dc',
  templateUrl: './add-contributors-dc.component.html',
  styleUrls: ['./add-contributors-dc.component.scss'],
  standalone: false,
})
export class AddContributorsDcComponent implements OnInit {
  /** Every contributor of the establishment, eligible or not. */
  @Input() contributors: Contributor[] = [];
  /** Already added — shown as ticked so this page also works for "Manage". */
  @Input() selectedContributors: Contributor[] = [];
  @Input() maxCount = 0;

  @Output() save = new EventEmitter<Contributor[]>();
  @Output() back = new EventEmitter<void>();

  searchText = '';
  pageSize = 5;
  currentPage = 1;
  selectedIds: string[] = [];

  ngOnInit(): void {
    this.selectedIds = this.selectedContributors.map((c) => c.nnid);
  }

  get filteredContributors(): Contributor[] {
    const text = this.searchText.trim().toLowerCase();
    return this.contributors.filter((c) => c.name.toLowerCase().includes(text) || c.nnid.includes(text));
  }

  get pagedContributors(): Contributor[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredContributors.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredContributors.length / this.pageSize));
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  onSearch(): void {
    this.currentPage = 1;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  isSelected(contributor: Contributor): boolean {
    return this.selectedIds.includes(contributor.nnid);
  }

  isDisabled(contributor: Contributor): boolean {
    const limitReached = this.selectedIds.length >= this.maxCount;
    return !contributor.eligible || (limitReached && !this.isSelected(contributor));
  }

  toggle(contributor: Contributor): void {
    if (this.isSelected(contributor)) {
      this.selectedIds = this.selectedIds.filter((id) => id !== contributor.nnid);
    } else {
      this.selectedIds = [...this.selectedIds, contributor.nnid];
    }
  }

  onSubmit(): void {
    this.save.emit(this.contributors.filter((c) => this.isSelected(c)));
  }
}
