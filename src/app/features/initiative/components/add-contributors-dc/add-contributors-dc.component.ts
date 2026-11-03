import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Contributor } from '../initiative.models';
import { idSet, matchesSearch, memoize } from '../list-utils';

/** Drawer — pick eligible contributors to add, up to the places left. */
@Component({
  selector: 'app-add-contributors-dc',
  templateUrl: './add-contributors-dc.component.html',
  styleUrls: ['./add-contributors-dc.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class AddContributorsDcComponent implements OnInit, AfterViewInit {
  /** Eligible contributors who aren't in the initiative yet. */
  @Input() contributors: Contributor[] = [];
  /** Places left before the establishment limit */
  @Input() remaining = 0;
  /** Ticked when the drawer opens, e.g. when coming back from the IBAN drawer */
  @Input() selected: Contributor[] = [];
  /** A request is on its way — sending again is blocked */
  @Input() busy = false;

  @Output() add = new EventEmitter<Contributor[]>();
  @Output() close = new EventEmitter<void>();

  @ViewChild('closeButton') closeButton!: ElementRef<HTMLButtonElement>;

  searchText = '';
  pageSize = 10;
  page = 1;
  selectedIds: string[] = [];

  ngOnInit(): void {
    this.selectedIds = this.selected.map((c) => c.nnid);
  }

  /** Moves keyboard focus into the drawer, so it isn't left on the page behind */
  ngAfterViewInit(): void {
    this.closeButton.nativeElement.focus();
  }

  get remainingAfterSelection(): number {
    return this.remaining - this.selectedIds.length;
  }

  get filteredContributors(): Contributor[] {
    return this.filter(this.contributors, this.searchText);
  }

  // Cached: these getters run on every change detection, and lists can be thousands of rows
  private selectedSet = idSet();
  private filter = memoize((contributors: Contributor[], search: string) => {
    const text = search.trim().toLowerCase();
    return contributors.filter((c) => matchesSearch(c, text));
  });

  get pagedContributors(): Contributor[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredContributors.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredContributors.length / this.pageSize));
  }

  get allPageSelected(): boolean {
    return this.pagedContributors.length > 0 && this.pagedContributors.every((c) => this.isSelected(c));
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close.emit();
  }

  onSearch(): void {
    this.page = 1;
  }

  isSelected(contributor: Contributor): boolean {
    return this.selectedSet(this.selectedIds).has(contributor.nnid);
  }

  isDisabled(contributor: Contributor): boolean {
    return !this.isSelected(contributor) && this.remainingAfterSelection <= 0;
  }

  toggle(contributor: Contributor): void {
    if (this.isSelected(contributor)) {
      this.selectedIds = this.selectedIds.filter((id) => id !== contributor.nnid);
    } else if (!this.isDisabled(contributor)) {
      this.selectedIds = [...this.selectedIds, contributor.nnid];
    }
  }

  /** The header checkbox ticks the rows on this page, as many as there are places for */
  toggleAll(): void {
    if (this.allPageSelected) {
      const pageIds = this.pagedContributors.map((c) => c.nnid);
      this.selectedIds = this.selectedIds.filter((id) => !pageIds.includes(id));
      return;
    }
    const toAdd = this.pagedContributors
      .filter((c) => !this.isSelected(c))
      .slice(0, this.remainingAfterSelection)
      .map((c) => c.nnid);
    this.selectedIds = [...this.selectedIds, ...toAdd];
  }

  onAdd(): void {
    this.add.emit(this.contributors.filter((c) => this.isSelected(c)));
  }
}
