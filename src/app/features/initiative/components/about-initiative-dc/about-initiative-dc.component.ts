import { Component, input, output } from '@angular/core';
import { Faq } from '../../initiative.models';

@Component({
  selector: 'app-about-initiative-dc',
  templateUrl: './about-initiative-dc.component.html',
  styleUrl: './about-initiative-dc.component.scss',
  standalone: false,
})
export class AboutInitiativeDcComponent {
  readonly faqs = input.required<Faq[]>();
  readonly apply = output<void>();
}
