import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Contributor } from '../../initiative.models';

@Component({
  selector: 'app-contributors-dc',
  templateUrl: './contributors-dc.component.html',
  styleUrls: ['./contributors-dc.component.scss'],
  standalone: false,
})
export class ContributorsDcComponent {
  @Input() contributors: Contributor[] = [];

  @Output() manage = new EventEmitter<void>();
  @Output() remove = new EventEmitter<Contributor>();

  searchText = '';

  get filteredContributors(): Contributor[] {
    const text = this.searchText.trim().toLowerCase();
    return this.contributors.filter((c) => c.name.toLowerCase().includes(text) || c.nnid.includes(text));
  }
}
