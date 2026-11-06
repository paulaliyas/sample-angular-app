import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { Contributor, ContributorSelection, SelectionStrategy, STRATEGY_OPTIONS } from '../initiative.models';
import { idSet, matchesSearch, memoize } from '../list-utils';

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

  /** Share of the Saudi contributors the establishment can enrol (e.g. 600 of 1000 → 60) */
  get benefitPercent(): number {
    return this.contributors.length ? Math.round((this.maxCount / this.contributors.length) * 100) : 0;
  }

  /** Estimated benefit amount shown on each strategy card */
  // TODO: replace these static values with the totals from the API
  estimatedBenefit(strategy: SelectionStrategy): number {
    const amounts: Partial<Record<SelectionStrategy, number>> = {
      highest: 1500000,
      lowest: 900000,
      joining: 1090000,
    };
    return amounts[strategy] ?? 0;
  }

  get notSelectedCount(): number {
    return this.contributors.length - this.selectedIds.length;
  }

  get withoutIbanCount(): number {
    return this.countWithoutIban(this.contributors, this.selectedIds);
  }

  get filteredContributors(): Contributor[] {
    return this.filter(this.contributors, this.selectedIds, this.tab, this.searchText);
  }

  // Cached: these getters run on every change detection, and lists can be thousands of rows
  private selectedSet = idSet();
  private countWithoutIban = memoize((contributors: Contributor[], ids: string[]) => {
    const selected = this.selectedSet(ids);
    return contributors.filter((c) => selected.has(c.nnid) && !c.iban).length;
  });
  private filter = memoize((contributors: Contributor[], ids: string[], tab: string, search: string) => {
    const selected = this.selectedSet(ids);
    const text = search.trim().toLowerCase();
    return contributors.filter((c) => selected.has(c.nnid) === (tab === 'selected') && matchesSearch(c, text));
  });

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
    return this.selectedSet(this.selectedIds).has(contributor.nnid);
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
