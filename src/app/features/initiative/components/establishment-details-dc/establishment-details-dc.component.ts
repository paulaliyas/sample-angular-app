import { Component, input, output } from '@angular/core';
import { Establishment } from '../../initiative.models';

@Component({
  selector: 'app-establishment-details-dc',
  templateUrl: './establishment-details-dc.component.html',
  styleUrl: './establishment-details-dc.component.scss',
  standalone: false,
})
export class EstablishmentDetailsDcComponent {
  readonly establishment = input.required<Establishment>();
  readonly declarationAccepted = input(false);
  readonly saving = input(false);

  readonly declarationChange = output<boolean>();
  readonly save = output<void>();
  readonly back = output<void>();
}
