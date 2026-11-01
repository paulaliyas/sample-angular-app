import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-pagination-dc',
  templateUrl: './pagination-dc.component.html',
  styleUrls: ['./pagination-dc.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class PaginationDcComponent {
  @Input() page = 1;
  @Input() totalPages = 1;

  @Output() pageChange = new EventEmitter<number>();

  /** Page numbers to show; null is a "…" gap. e.g. 1 2 3 … 8 9 10 */
  get items(): (number | null)[] {
    const shown = [1, 2, 3, this.page - 1, this.page, this.page + 1, this.totalPages - 2, this.totalPages - 1, this.totalPages]
      .filter((p, i, all) => p >= 1 && p <= this.totalPages && all.indexOf(p) === i)
      .sort((a, b) => a - b);

    const items: (number | null)[] = [];
    shown.forEach((p, i) => {
      const skipped = i > 0 ? p - shown[i - 1] - 1 : 0;
      if (skipped === 1) {
        // A "…" standing for a single page is no shorter than the page number itself
        items.push(p - 1);
      } else if (skipped > 1) {
        items.push(null);
      }
      items.push(p);
    });
    return items;
  }

  goTo(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.page) {
      this.pageChange.emit(page);
    }
  }
}
