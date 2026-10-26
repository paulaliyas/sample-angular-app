import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize, forkJoin, Observable, switchMap } from 'rxjs';
import { Contributor, Establishment, Faq } from '../../initiative.models';
import { InitiativeService } from '../../services';

export type InitiativeStep = 'about' | 'establishment' | 'contributors' | 'add-contributors';

/**
 * Smart component for the initiative. Owns the state, makes every API call,
 * and shows one dc step at a time — each "save" calls the API, then moves on.
 */
@Component({
  selector: 'app-initiative-sc',
  templateUrl: './initiative-sc.component.html',
  styleUrl: './initiative-sc.component.scss',
  standalone: false,
})
export class InitiativeScComponent implements OnInit {
  private readonly api = inject(InitiativeService);
  private readonly destroyRef = inject(DestroyRef);

  readonly step = signal<InitiativeStep>('about');
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly faqs = signal<Faq[]>([]);
  readonly establishment = signal<Establishment | null>(null);
  readonly declarationAccepted = signal(false);
  readonly contributors = signal<Contributor[]>([]);
  readonly candidates = signal<Contributor[]>([]);
  readonly maxContributors = signal(0);
  readonly addedNnids = computed(() => this.contributors().map((c) => c.nnid));

  ngOnInit(): void {
    this.request(this.api.getFaqs(), (faqs) => this.faqs.set(faqs));
  }

  /** About → Establishment Details */
  onApply(): void {
    this.request(this.api.getEstablishment(), (establishment) => {
      this.establishment.set(establishment);
      this.step.set('establishment');
    });
  }

  /** Establishment Details → Contributors: submit the application, then load the contributors. */
  onSaveApplication(): void {
    const establishment = this.establishment();
    if (!establishment || !this.declarationAccepted()) return;

    const save$ = this.api
      .submitApplication(establishment.registrationNumber)
      .pipe(switchMap(() => this.api.getContributors()));

    this.request(save$, (contributors) => {
      this.contributors.set(contributors);
      this.step.set('contributors');
    });
  }

  /** Contributors → Add Contributors */
  onManageContributors(): void {
    this.request(forkJoin([this.api.getCandidates(), this.api.getMaxContributors()]), ([candidates, max]) => {
      this.candidates.set(candidates);
      this.maxContributors.set(max);
      this.step.set('add-contributors');
    });
  }

  /** Add Contributors → Contributors: save the selection. */
  onSaveContributors(nnids: string[]): void {
    this.request(this.api.saveContributors(nnids), (contributors) => {
      this.contributors.set(contributors);
      this.step.set('contributors');
    });
  }

  onRemoveContributor(contributor: Contributor): void {
    this.request(this.api.removeContributor(contributor.nnid), () =>
      this.contributors.update((list) => list.filter((c) => c.nnid !== contributor.nnid)),
    );
  }

  /** Back / Cancel — no API call. */
  goTo(step: InitiativeStep): void {
    this.error.set(null);
    this.step.set(step);
  }

  private request<T>(source: Observable<T>, onSuccess: (value: T) => void): void {
    this.loading.set(true);
    this.error.set(null);
    source
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: onSuccess,
        error: () => this.error.set('Something went wrong. Please try again.'),
      });
  }
}
