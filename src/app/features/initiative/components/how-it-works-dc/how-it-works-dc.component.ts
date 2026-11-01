import { Component, Input, ViewEncapsulation } from '@angular/core';

/** The "How it works" stepper shown on every application step. */
@Component({
  selector: 'app-how-it-works-dc',
  templateUrl: './how-it-works-dc.component.html',
  styleUrls: ['./how-it-works-dc.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class HowItWorksDcComponent {
  /** 1-based; earlier steps show as done */
  @Input() currentStep = 1;
  /** Square corners, for when the card above it continues into it */
  @Input() attached = false;

  steps = [
    { title: 'Apply', description: 'Review details and accept terms and conditions.' },
    { title: 'Choose Contributors', description: 'Select eligible Saudi contributors' },
    { title: 'Bank Account Update', description: 'Update contributors missing IBAN' },
    { title: 'Summary', description: 'Review transaction details and confirm' },
  ];
}
