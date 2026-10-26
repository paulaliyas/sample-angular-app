import { Component, computed, input, output, signal } from '@angular/core';
import { Contributor } from '../../initiative.models';
import { filterContributors } from '../../initiative.utils';

@Component({
  selector: 'app-contributors-dc',
  templateUrl: './contributors-dc.component.html',
  styleUrl: './contributors-dc.component.scss',
  standalone: false,
})
export class ContributorsDcComponent {
  readonly contributors = input.required<Contributor[]>();
  readonly busy = input(false);

  /** Opens the add/manage step. */
  readonly manage = output<void>();
  readonly remove = output<Contributor>();

  protected readonly query = signal('');
  protected readonly hasContributors = computed(() => this.contributors().length > 0);
  protected readonly rows = computed(() => filterContributors(this.contributors(), this.query()));
}
