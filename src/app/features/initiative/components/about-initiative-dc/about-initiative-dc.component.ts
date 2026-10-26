import { Component, EventEmitter, Output } from '@angular/core';
import { Faq } from '../../initiative.models';

@Component({
  selector: 'app-about-initiative-dc',
  templateUrl: './about-initiative-dc.component.html',
  styleUrls: ['./about-initiative-dc.component.scss'],
  standalone: false,
})
export class AboutInitiativeDcComponent {
  @Output() apply = new EventEmitter<void>();

  // TODO: real answers aren't in the design yet
  faqs: Faq[] = [
    { question: 'What is the Daam Initiative for the Aviation Sector?', answer: 'Answer content goes here.' },
    { question: "What are the initiative's eligibility conditions?", answer: 'Answer content goes here.' },
    { question: 'What percentage is covered by the employer?', answer: 'Answer content goes here.' },
    { question: 'What percentage is covered by the contributor?', answer: 'Answer content goes here.' },
    { question: 'How is the employer compensated for the initiative amount?', answer: 'Answer content goes here.' },
    { question: 'Is there a specific duration for the initiative?', answer: 'Answer content goes here.' },
    { question: 'How do I add a contributor to the initiative?', answer: 'Answer content goes here.' },
    { question: 'Terms and Conditions', answer: 'Answer content goes here.' },
  ];
}
