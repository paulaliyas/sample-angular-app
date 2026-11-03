import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { Contributor } from '../initiative.models';
import { matchesSearch, memoize } from '../list-utils';

/**
 * Step 3 — add the missing IBANs and, if needed, correct existing ones.
 * Missing ones are typed straight in; existing ones are locked until the pencil is pressed.
 */
@Component({
  selector: 'app-bank-account-dc',
  templateUrl: './bank-account-dc.component.html',
  styleUrls: ['./bank-account-dc.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class BankAccountDcComponent implements OnInit {
  /** The contributors chosen on the previous step. */
  @Input() contributors: Contributor[] = [];
  /** Bank names the API gave for IBANs typed here (IBAN → bank name) */
  @Input() bankNames: Record<string, string> = {};

  /** The same contributors with their new IBANs */
  @Output() next = new EventEmitter<Contributor[]>();
  @Output() back = new EventEmitter<void>();
  /** An IBAN was typed, so the API can look up its bank */
  @Output() ibanEntered = new EventEmitter<string>();

  /** 'missing' | 'existing' */
  tab = 'missing';
  searchText = '';
  pageSize = 10;
  page = 1;

  /** IBAN per contributor (nnid → IBAN), as the API gave it or as typed — the API validates it */
  ibans: Record<string, string> = {};
  /** The existing-IBAN row being edited, and its unsaved value */
  editingId: string | null = null;
  editValue = '';

  // Fixed when the step opens, so rows don't jump tabs while typing
  private missing: Contributor[] = [];
  private existing: Contributor[] = [];

  ngOnInit(): void {
    this.missing = this.contributors.filter((c) => !c.iban);
    this.existing = this.contributors.filter((c) => !!c.iban);
    this.contributors.forEach((c) => (this.ibans[c.nnid] = c.iban ?? ''));
    // Nothing to fill in, so start on the list that has rows
    if (this.missing.length === 0) {
      this.tab = 'existing';
    }
  }

  get missingCount(): number {
    return this.missing.length;
  }

  get existingCount(): number {
    return this.existing.length;
  }

  /** Still without an IBAN */
  get stillMissingCount(): number {
    return this.missing.filter((c) => !this.ibans[c.nnid].trim()).length;
  }

  get filteredContributors(): Contributor[] {
    return this.filter(this.tab === 'missing' ? this.missing : this.existing, this.searchText);
  }

  // Cached: this getter runs on every change detection, and lists can be thousands of rows
  private filter = memoize((list: Contributor[], search: string) => {
    const text = search.trim().toLowerCase();
    return list.filter((c) => matchesSearch(c, text));
  });

  get pagedContributors(): Contributor[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredContributors.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredContributors.length / this.pageSize));
  }

  showTab(tab: string): void {
    this.cancelEdit();
    this.tab = tab;
    this.page = 1;
  }

  // Searching or paging can hide the row being edited, which would leave Next stuck — so the edit is dropped
  onSearch(): void {
    this.cancelEdit();
    this.page = 1;
  }

  goToPage(page: number): void {
    this.cancelEdit();
    this.page = page;
  }

  /** What the IBAN field of this row shows */
  valueOf(contributor: Contributor): string {
    return this.editingId === contributor.nnid ? this.editValue : this.ibans[contributor.nnid];
  }

  /** The API's bank name for the contributor's own IBAN, or the looked-up one for a typed IBAN */
  bankOf(contributor: Contributor): string {
    const iban = this.valueOf(contributor).trim();
    return iban === contributor.iban ? (contributor.bankName ?? '') : (this.bankNames[iban] ?? '');
  }

  isLocked(contributor: Contributor): boolean {
    return this.tab === 'existing' && this.editingId !== contributor.nnid;
  }

  /** The API's own IBAN, unchanged — the only kind shown as verified */
  isVerified(contributor: Contributor): boolean {
    return !!contributor.iban && this.valueOf(contributor) === contributor.iban;
  }

  onInput(contributor: Contributor, input: HTMLInputElement): void {
    if (this.editingId === contributor.nnid) {
      this.editValue = input.value;
    } else {
      this.ibans[contributor.nnid] = input.value;
    }
  }

  /** Typing finished (the field lost focus) — look up the bank once per new IBAN */
  onChange(contributor: Contributor): void {
    const iban = this.valueOf(contributor).trim();
    if (iban && iban !== contributor.iban && !(iban in this.bankNames)) {
      this.ibanEntered.emit(iban);
    }
  }

  startEdit(contributor: Contributor, input: HTMLInputElement): void {
    this.editingId = contributor.nnid;
    this.editValue = this.ibans[contributor.nnid];
    input.focus();
    input.select();
  }

  saveEdit(): void {
    if (this.editingId && this.editValue.trim()) {
      this.ibans[this.editingId] = this.editValue;
      this.editingId = null;
    }
  }

  cancelEdit(): void {
    this.editingId = null;
  }

  onNext(): void {
    this.next.emit(
      this.contributors.map((c) => {
        const iban = this.ibans[c.nnid].trim();
        return iban ? { ...c, iban } : c;
      }),
    );
  }
}
