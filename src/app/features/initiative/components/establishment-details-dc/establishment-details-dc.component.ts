import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Establishment } from '../../initiative.models';

@Component({
  selector: 'app-establishment-details-dc',
  templateUrl: './establishment-details-dc.component.html',
  styleUrls: ['./establishment-details-dc.component.scss'],
  standalone: false,
})
export class EstablishmentDetailsDcComponent {
  @Input() establishment!: Establishment;

  @Output() save = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();

  declarationAccepted = false;

  onSubmit(): void {
    if (this.declarationAccepted) {
      this.save.emit();
    }
  }
}
