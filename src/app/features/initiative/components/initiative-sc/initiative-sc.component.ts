import { Component } from '@angular/core';
import { Contributor, Establishment } from '../../initiative.models';

/**
 * Smart component for the initiative.
 * Holds the data and shows one step at a time — each save moves to the next step.
 * API calls go in the methods below (marked TODO).
 */
@Component({
  selector: 'app-initiative-sc',
  templateUrl: './initiative-sc.component.html',
  styleUrls: ['./initiative-sc.component.scss'],
  standalone: false,
})
export class InitiativeScComponent {
  /** 'about' | 'establishment' | 'contributors' | 'add-contributors' */
  step = 'about';

  maxContributors = 600;

  establishment: Establishment = {
    name: 'شركة عبدالله فهد المطيري للخدمات المسانده',
    registrationNumber: '536562462',
  };

  // Sample data from the design — TODO: load from the API
  allContributors: Contributor[] = [
    { nnid: '98765432101', name: 'Mohammed Abdullah Al-Khudhair', joiningDate: '2026/10/26', wage: 7500, eligible: true },
    { nnid: '98765432102', name: 'Fahad Mohammed Al-Shammari', joiningDate: '2026/10/26', wage: 6200, eligible: false, ineligibilityReason: 'Reason for Ineligibility' },
    { nnid: '98765432103', name: 'Abdullah Khalid Al-Harbi', joiningDate: '2026/10/26', wage: 4800, eligible: true },
    { nnid: '98765432104', name: 'Nasser Ibrahim Al-Qahtani', joiningDate: '2026/10/26', wage: 9100, eligible: true },
    { nnid: '98765432105', name: 'Saud Abdulrahman Al-Zahrani', joiningDate: '2026/10/26', wage: 3500, eligible: true },
    { nnid: '98765432106', name: 'Mohammed Yousef Al-Otaibi', joiningDate: '2026/10/26', wage: 8700, eligible: true },
    { nnid: '98765432107', name: 'Khalid Abdullah Al-Subaie', joiningDate: '2026/10/26', wage: 1300, eligible: true },
    { nnid: '98765432108', name: 'Abdulaziz Sulaiman Al-Dosari', joiningDate: '2026/10/26', wage: 5600, eligible: false, ineligibilityReason: 'Reason for Ineligibility' },
    { nnid: '98765432109', name: 'Faisal Abdullah Al-Ghamdi', joiningDate: '2026/10/26', wage: 7200, eligible: true },
    { nnid: '98765432110', name: 'Turki Mohammed Al-Harbi', joiningDate: '2026/10/26', wage: 4000, eligible: true },
  ];

  /** Contributors added to the initiative. */
  addedContributors: Contributor[] = [];

  /** About → Establishment Details */
  onApply(): void {
    this.step = 'establishment';
  }

  /** Establishment Details → Contributors */
  onSaveApplication(): void {
    // TODO: call the API to submit the application
    this.step = 'contributors';
  }

  /** Contributors → Add Contributors */
  onManageContributors(): void {
    this.step = 'add-contributors';
  }

  /** Add Contributors → Contributors */
  onSaveContributors(selected: Contributor[]): void {
    // TODO: call the API to save the contributors
    this.addedContributors = selected;
    this.step = 'contributors';
  }

  onRemoveContributor(contributor: Contributor): void {
    // TODO: call the API to remove the contributor
    this.addedContributors = this.addedContributors.filter((c) => c.nnid !== contributor.nnid);
  }

  /** Cancel / back */
  goTo(step: string): void {
    this.step = step;
  }
}
