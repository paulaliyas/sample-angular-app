import { Component, output } from '@angular/core';

/** Search box + Filter button used above both contributor tables. */
@Component({
  selector: 'app-contributor-search-dc',
  templateUrl: './contributor-search-dc.component.html',
  styleUrl: './contributor-search-dc.component.scss',
  standalone: false,
})
export class ContributorSearchDcComponent {
  readonly queryChange = output<string>();
}
