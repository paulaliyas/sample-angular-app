import { Component, EventEmitter, Input, OnChanges, Output, ViewEncapsulation } from '@angular/core';

/** Most page slots shown, gaps included, so the bar keeps one width as the page changes. */
const MAX_SLOTS = 7;

@Component({
  selector: 'app-pagination-dc',
  templateUrl: './pagination-dc.component.html',
  styleUrls: ['./pagination-dc.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class PaginationDcComponent implements OnChanges {
  @Input() page = 1;
  @Input() totalPages = 1;

  @Output() pageChange = new EventEmitter<number>();

  /** Page numbers to show; null is a "…" gap. Always at most 7 slots, e.g. 1 … 49 50 51 … 100 */
  items: (number | null)[] = [1];

  ngOnChanges(): void {
    const total = Math.max(1, this.totalPages);
    // The list shrank (search, removal, new data) and left the page past the end:
    // move back to the last page. Emitted after this change detection pass finishes.
    if (this.page > total || this.page < 1) {
      const page = Math.min(Math.max(1, this.page), total);
      Promise.resolve().then(() => this.pageChange.emit(page));
    }
    this.items = pageItems(Math.min(Math.max(1, this.page), total), total);
  }

  goTo(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.page) {
      this.pageChange.emit(page);
    }
  }
}

/**
 * 1 2 3 4 5 … 100   (near the start)
 * 1 … 49 50 51 … 100 (in the middle)
 * 1 … 96 97 98 99 100 (near the end)
 */
function pageItems(page: number, total: number): (number | null)[] {
  if (total <= MAX_SLOTS) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  if (page <= 4) {
    return [1, 2, 3, 4, 5, null, total];
  }
  if (page >= total - 3) {
    return [1, null, total - 4, total - 3, total - 2, total - 1, total];
  }
  return [1, null, page - 1, page, page + 1, null, total];
}
