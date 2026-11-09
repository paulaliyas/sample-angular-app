import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Contributor } from '../initiative.models';

/** Drawer — IBANs for the contributors being added (existing ones filled in); every one needs an IBAN to submit. */
@Component({
  selector: 'app-add-missing-iban-dc',
  templateUrl: './add-missing-iban-dc.component.html',
  styleUrls: ['./add-missing-iban-dc.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class AddMissingIbanDcComponent implements OnInit, AfterViewInit {
  @Input() contributors: Contributor[] = [];
  /** IBANs typed earlier (nnid → IBAN), when coming back to the drawer */
  @Input() drafts: Record<string, string> = {};
  /** Bank names the API gave for IBANs typed here (IBAN → bank name) */
  @Input() bankNames: Record<string, string> = {};
  /** A request is on its way — sending again is blocked */
  @Input() busy = false;

  /** The same contributors, now with their IBANs */
  @Output() submitIbans = new EventEmitter<Contributor[]>();
  /** Emits what has been typed so far, so it isn't lost */
  @Output() back = new EventEmitter<Record<string, string>>();
  /** An IBAN was typed, so the API can look up its bank */
  @Output() ibanEntered = new EventEmitter<string>();

  @ViewChild('closeButton') closeButton!: ElementRef<HTMLButtonElement>;

  searchText = '';
  /** nnid → IBAN as typed — the API validates it */
  ibans: Record<string, string> = {};

  ngOnInit(): void {
    this.contributors.forEach((c) => (this.ibans[c.nnid] = this.drafts[c.nnid] ?? c.iban ?? ''));
    // Contributors who already have an IBAN show it filled in, so look up its bank too
    this.contributors.forEach((c) => this.onChange(c));
  }

  /** Moves keyboard focus into the drawer, so it isn't left on the page behind */
  ngAfterViewInit(): void {
    this.closeButton.nativeElement.focus();
  }

  get filteredContributors(): Contributor[] {
    const text = this.searchText.trim().toLowerCase();
    return this.contributors.filter((c) => c.name.toLowerCase().includes(text) || c.nnid.includes(text));
  }

  /** Every contributor has an IBAN, including rows hidden by the search */
  get allFilled(): boolean {
    return this.contributors.every((c) => !!this.ibans[c.nnid].trim());
  }

  @HostListener('document:keydown.escape')
  onBack(): void {
    this.back.emit(this.ibans);
  }

  onInput(contributor: Contributor, input: HTMLInputElement): void {
    this.ibans[contributor.nnid] = input.value;
  }

  /** Typing finished (the field lost focus) — look up the bank once per new IBAN */
  onChange(contributor: Contributor): void {
    const iban = this.ibans[contributor.nnid].trim();
    if (iban && !(iban in this.bankNames)) {
      this.ibanEntered.emit(iban);
    }
  }

  bankOf(contributor: Contributor): string {
    return this.bankNames[this.ibans[contributor.nnid].trim()] ?? '';
  }

  onSubmit(): void {
    if (this.allFilled) {
      this.submitIbans.emit(this.contributors.map((c) => ({ ...c, iban: this.ibans[c.nnid].trim() })));
    }
  }
}
