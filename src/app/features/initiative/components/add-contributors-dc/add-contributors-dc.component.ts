import { Component, computed, input, linkedSignal, output, signal } from '@angular/core';
import { Contributor } from '../../initiative.models';
import { filterContributors, pageList } from '../../initiative.utils';

const PAGE_SIZE = 10;

@Component({
  selector: 'app-add-contributors-dc',
  templateUrl: './add-contributors-dc.component.html',
  styleUrl: './add-contributors-dc.component.scss',
  standalone: false,
})
export class AddContributorsDcComponent {
  /** Every contributor of the establishment, eligible or not. */
  readonly candidates = input.required<Contributor[]>();
  /** NNIDs already added — preselected so this step also works for "Manage". */
  readonly selectedNnids = input<string[]>([]);
  readonly maxCount = input.required<number>();
  readonly saving = input(false);

  /** Emits the selected NNIDs. */
  readonly save = output<string[]>();
  readonly back = output<void>();

  protected readonly query = signal('');
  protected readonly currentPage = signal(1);
  protected readonly selected = linkedSignal(() => new Set(this.selectedNnids()));

  private readonly filtered = computed(() => filterContributors(this.candidates(), this.query()));
  protected readonly totalPages = computed(() => Math.max(1, Math.ceil(this.filtered().length / PAGE_SIZE)));
  protected readonly pageRows = computed(() => {
    const start = (this.currentPage() - 1) * PAGE_SIZE;
    return this.filtered().slice(start, start + PAGE_SIZE);
  });
  protected readonly pages = computed(() => pageList(this.currentPage(), this.totalPages()));
  protected readonly selectedCount = computed(() => this.selected().size);
  protected readonly limitReached = computed(() => this.selectedCount() >= this.maxCount());

  protected search(query: string) {
    this.query.set(query);
    this.currentPage.set(1);
  }

  protected goToPage(page: number) {
    this.currentPage.set(Math.min(Math.max(page, 1), this.totalPages()));
  }

  protected isSelected(contributor: Contributor) {
    return this.selected().has(contributor.nnid);
  }

  protected toggle(contributor: Contributor, checked: boolean) {
    this.selected.update((set) => {
      const next = new Set(set);
      if (checked) next.add(contributor.nnid);
      else next.delete(contributor.nnid);
      return next;
    });
  }

  protected submit() {
    this.save.emit([...this.selected()]);
  }
}
