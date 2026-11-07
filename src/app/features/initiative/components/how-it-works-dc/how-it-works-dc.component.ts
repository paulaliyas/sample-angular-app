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
    // Translation keys (initiative.howItWorks.steps)
    { title: 'initiative.howItWorks.steps.apply.title', description: 'initiative.howItWorks.steps.apply.description' },
    { title: 'initiative.howItWorks.steps.choose.title', description: 'initiative.howItWorks.steps.choose.description' },
    { title: 'initiative.howItWorks.steps.bank.title', description: 'initiative.howItWorks.steps.bank.description' },
    { title: 'initiative.howItWorks.steps.summary.title', description: 'initiative.howItWorks.steps.summary.description' },
  ];
}
