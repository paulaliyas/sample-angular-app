import { Component, DestroyRef, ElementRef, OnInit, ViewEncapsulation } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { currentLang } from '../i18n/initiative-translations';
import { InitiativeApiService } from '../initiative-api.service';
import {
  Contributor,
  ContributorSelection,
  Eligibility,
  Establishment,
  Faq,
  IbanUpdate,
  InitiativeMember,
  InitiativeRequest,
  SelectionStrategy,
  STRATEGY_OPTIONS,
} from '../initiative.models';

/**
 * Smart component for the initiative.
 * The only place that calls the API; holds the data and shows one screen at a time.
 * It starts with the eligibility call, which decides the path:
 *   not enrolled → apply → choose-contributors → bank-account → summary → dashboard
 *   enrolled     → dashboard
 * The dashboard has the Requests / Manage Contributors / IBAN Update tabs, plus the add drawers.
 */
@Component({
  selector: 'app-initiative-sc',
  templateUrl: './initiative-sc.component.html',
  styleUrls: [
    './styles/initiative-sc.component.scss',
    './styles/initiative-sc-tables.scss',
    './styles/initiative-sc-iban.scss',
    './styles/initiative-sc-drawer.scss',
  ],
  // Not encapsulated so the shared styles reach the dc components (they're scoped to app-initiative-sc)
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class InitiativeScComponent implements OnInit {
  /** 'apply' | 'choose-contributors' | 'bank-account' | 'summary' | 'dashboard' */
  step = 'apply';
  /** 'requests' | 'members' | 'iban-updates' */
  dashboardTab = 'requests';
  /** 'add-contributors' | 'missing-iban' | null */
  drawer: string | null = null;

  /** First load in progress */
  loading = true;
  /** The first screen's data is in; until then a failed load offers "Try again" */
  loaded = false;
  /** A request is being sent — its button is disabled so it can't be sent twice */
  saving = false;
  /** Translation key of the error to show */
  error = '';

  // From the API
  eligibility: Eligibility | null = null;
  faqs: Faq[] = [];
  eligibleContributors: Contributor[] = [];
  /** The list the API prepared for the chosen strategy */
  preparedSelection: Contributor[] | null = null;
  /** Bank names looked up for IBANs the user typed (IBAN → bank name) */
  bankNames: Record<string, string> = {};
  members: InitiativeMember[] = [];
  requests: InitiativeRequest[] = [];
  ibanUpdates: IbanUpdate[] = [];

  /** The terms popup was scrolled to the end — enables the declaration checkbox for the rest of the session */
  termsRead = false;
  /** From Choose Contributors */
  selection: ContributorSelection | null = null;
  /** The chosen contributors with the IBANs from Bank Account Update */
  applicationContributors: Contributor[] = [];
  /** Contributors being added while their missing IBANs are entered */
  pendingAdditions: Contributor[] = [];
  /** IBANs typed in the missing-IBAN drawer, kept while going back to the list */
  ibanDrafts: Record<string, string> = {};

  private strategyRequest?: Subscription;

  constructor(
    private api: InitiativeApiService,
    private host: ElementRef<HTMLElement>,
    private destroyRef: DestroyRef,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.load();
    // The FAQs come from the API per language, so fetch them again when the language changes
    this.translate.onLangChange.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      if (this.loaded && this.faqs.length) {
        this.call(this.api.getFaqs(currentLang(this.translate)), (faqs) => (this.faqs = faqs));
      }
    });
  }

  get establishment(): Establishment | null {
    return this.eligibility?.establishment ?? null;
  }

  get maxContributors(): number {
    return this.eligibility?.maxContributors ?? 0;
  }

  get strategyTitle(): string {
    return STRATEGY_OPTIONS.find((s) => s.value === this.selection?.strategy)?.title ?? '';
  }

  get totalBenefit(): number {
    return this.applicationContributors.reduce((sum, c) => sum + c.benefitAmount, 0);
  }

  /** Eligible contributors who aren't in the initiative */
  get candidates(): Contributor[] {
    return this.eligibleContributors.filter((c) => !this.members.some((m) => m.nnid === c.nnid));
  }

  get remainingPlaces(): number {
    return Math.max(0, this.maxContributors - this.members.length);
  }

  /** Eligibility first; its "enrolled" flag decides which path's data to load and which screen to show */
  load(): void {
    this.loading = true;
    this.error = '';
    this.call(
      this.api.getEligibility(),
      (eligibility) => {
        this.eligibility = eligibility;
        if (eligibility.enrolled) {
          this.loadDashboard(() => this.showFirstScreen('dashboard'));
        } else {
          this.loadEnrolment(() => this.showFirstScreen('apply'));
        }
      },
      'initiative.errors.load',
    );
  }

  /* ===== Application ===== */

  /** Apply → Choose Contributors */
  onApply(): void {
    if (!this.selection) {
      this.onStrategyChange('highest');
    }
    this.goTo('choose-contributors');
  }

  onStrategyChange(strategy: SelectionStrategy): void {
    // Only the latest pick counts, even if an earlier response arrives after it
    this.strategyRequest?.unsubscribe();
    this.strategyRequest = this.call(
      this.api.getStrategySelection(strategy),
      (contributors) => (this.preparedSelection = contributors),
      'initiative.errors.prepareList',
    );
  }

  /** Choose Contributors → Bank Account Update */
  onChooseContributors(selection: ContributorSelection): void {
    this.selection = selection;
    // Keep IBANs already entered, in case the user came back to change the list
    this.applicationContributors = selection.contributors.map(
      (c) => this.applicationContributors.find((a) => a.nnid === c.nnid) ?? c,
    );
    this.goTo('bank-account');
  }

  onIbanEntered(iban: string): void {
    this.call(this.api.getBankName(iban), (name) => (this.bankNames = { ...this.bankNames, [iban]: name }));
  }

  /** Bank Account Update → Summary */
  onBankAccountNext(contributors: Contributor[]): void {
    this.applicationContributors = contributors;
    this.goTo('summary');
  }

  /** Summary → Dashboard */
  onSubmitRequest(): void {
    this.save(
      this.api.submitApplication({ strategy: this.selection!.strategy, contributors: this.applicationContributors }),
      () => {
        this.dashboardTab = 'requests';
        this.goTo('dashboard');
      },
      'initiative.errors.submit',
    );
  }

  /* ===== Dashboard ===== */

  onRemoveMembers(removed: InitiativeMember[]): void {
    this.save(this.api.removeContributors(removed), () => {}, 'initiative.errors.remove');
  }

  /** Add Contributors drawer → IBAN drawer, where Submit adds them and returns to the list */
  onAddContributors(selected: Contributor[]): void {
    this.pendingAdditions = selected;
    this.drawer = 'missing-iban';
  }

  onMissingIbansSubmitted(withIbans: Contributor[]): void {
    this.addMembers(this.pendingAdditions.map((c) => withIbans.find((w) => w.nnid === c.nnid) ?? c));
  }

  /** Missing IBAN drawer → back to the Add Contributors drawer, keeping what was typed */
  onMissingIbansBack(drafts: Record<string, string>): void {
    this.ibanDrafts = drafts;
    this.drawer = 'add-contributors';
  }

  openDrawer(drawer: string): void {
    this.drawer = drawer;
  }

  closeDrawer(): void {
    this.drawer = null;
    this.pendingAdditions = [];
    this.ibanDrafts = {};
  }

  /* ===== Navigation ===== */

  /** Cancel / back */
  goTo(step: string): void {
    this.step = step;
    // The new screen would otherwise open at the old scroll position, part-way down
    if (this.host.nativeElement.getBoundingClientRect().top < 0) {
      this.host.nativeElement.scrollIntoView?.({ block: 'start' });
    }
  }

  /* ===== Helpers ===== */

  private addMembers(contributors: Contributor[]): void {
    this.save(this.api.addContributors(contributors), () => this.closeDrawer(), 'initiative.errors.add');
  }

  private showFirstScreen(step: string): void {
    this.loading = false;
    this.loaded = true;
    this.goTo(step);
  }

  /** What the enrolment path needs */
  private loadEnrolment(done: () => void): void {
    this.call(
      forkJoin({ faqs: this.api.getFaqs(currentLang(this.translate)), contributors: this.api.getEligibleContributors() }),
      ({ faqs, contributors }) => {
        this.faqs = faqs;
        this.eligibleContributors = contributors;
        done();
      },
      'initiative.errors.load',
    );
  }

  /** The dashboard lists, plus the contributors (their IBANs may have changed, and the add drawer needs them) */
  private loadDashboard(done = () => {}): void {
    this.call(
      forkJoin({
        requests: this.api.getRequests(),
        members: this.api.getMembers(),
        ibanUpdates: this.api.getIbanUpdates(),
        contributors: this.api.getEligibleContributors(),
      }),
      ({ requests, members, ibanUpdates, contributors }) => {
        this.requests = requests;
        this.members = members;
        this.ibanUpdates = ibanUpdates;
        this.eligibleContributors = contributors;
        done();
      },
      'initiative.errors.load',
    );
  }

  /** Sends a change, then reloads the dashboard from the API */
  private save(request: Observable<InitiativeRequest>, done: () => void, errorMessage: string): void {
    if (this.saving) {
      return;
    }
    this.saving = true;
    this.error = '';
    this.call(
      request,
      () => {
        this.saving = false;
        this.loadDashboard();
        done();
      },
      errorMessage,
    );
  }

  private call<T>(request: Observable<T>, next: (value: T) => void, errorMessage = ''): Subscription {
    return request.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next,
      error: () => {
        this.loading = false;
        this.saving = false;
        this.error = errorMessage;
      },
    });
  }
}
