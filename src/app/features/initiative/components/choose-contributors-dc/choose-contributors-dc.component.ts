import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { Contributor, ContributorSelection, SelectionStrategy, STRATEGY_OPTIONS } from '../initiative.models';

/** Step 2 — pick a strategy that pre-fills the list, then fine-tune it. */
@Component({
  selector: 'app-choose-contributors-dc',
  templateUrl: './choose-contributors-dc.component.html',
  styleUrls: ['./choose-contributors-dc.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class ChooseContributorsDcComponent implements OnInit, OnChanges {
  /** Every eligible contributor of the establishment. */
  @Input() contributors: Contributor[] = [];
  @Input() maxCount = 0;
  /** A previous selection, when coming back to edit it. */
  @Input() selection: ContributorSelection | null = null;
  /** The list the API prepared for the chosen strategy; replaces the current ticks when it arrives */
  @Input() preparedSelection: Contributor[] | null = null;

  /** A strategy was picked, so the list for it can be fetched */
  @Output() strategyChange = new EventEmitter<SelectionStrategy>();
  @Output() next = new EventEmitter<ContributorSelection>();
  @Output() cancel = new EventEmitter<void>();

  strategies = STRATEGY_OPTIONS;

  /** The SC fetches this strategy's list when the step opens */
  strategy: SelectionStrategy = 'highest';
  selectedIds: string[] = [];
  /** 'selected' | 'not-selected' */
  tab = 'selected';
  searchText = '';
  pageSize = 10;
  page = 1;

  // A previous selection wins over the prepared list (ngOnChanges runs first)
  ngOnInit(): void {
    if (this.selection) {
      this.strategy = this.selection.strategy;
      this.selectedIds = this.selection.contributors.map((c) => c.nnid);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['preparedSelection'] && this.preparedSelection) {
      this.selectedIds = this.preparedSelection.map((c) => c.nnid);
      this.page = 1;
    }
  }

  get strategyTitle(): string {
    return this.strategies.find((s) => s.value === this.strategy)!.title;
  }

  get notSelectedCount(): number {
    return this.contributors.length - this.selectedIds.length;
  }

  get withoutIbanCount(): number {
    return this.contributors.filter((c) => this.isSelected(c) && !c.iban).length;
  }

  get filteredContributors(): Contributor[] {
    const text = this.searchText.trim().toLowerCase();
    return this.contributors
      .filter((c) => this.isSelected(c) === (this.tab === 'selected'))
      .filter((c) => c.name.toLowerCase().includes(text) || c.nnid.includes(text));
  }

  get pagedContributors(): Contributor[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredContributors.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredContributors.length / this.pageSize));
  }

  /** The API fills the list up to the limit, in the order the strategy asks for */
  selectStrategy(strategy: SelectionStrategy): void {
    this.strategy = strategy;
    this.strategyChange.emit(strategy);
  }

  showTab(tab: string): void {
    this.tab = tab;
    this.page = 1;
  }

  onSearch(): void {
    this.page = 1;
  }

  isSelected(contributor: Contributor): boolean {
    return this.selectedIds.includes(contributor.nnid);
  }

  isDisabled(contributor: Contributor): boolean {
    return !this.isSelected(contributor) && this.selectedIds.length >= this.maxCount;
  }

  toggle(contributor: Contributor): void {
    if (this.isSelected(contributor)) {
      this.selectedIds = this.selectedIds.filter((id) => id !== contributor.nnid);
    } else if (!this.isDisabled(contributor)) {
      this.selectedIds = [...this.selectedIds, contributor.nnid];
    }
    // The row moves to the other tab, so the page may now be past the end
    this.page = Math.min(this.page, this.totalPages);
  }

  onNext(): void {
    this.next.emit({
      strategy: this.strategy,
      contributors: this.contributors.filter((c) => this.isSelected(c)),
    });
  }
}
