import { formatDate } from '@angular/common';
import { Injectable } from '@angular/core';
import { defer, delay, Observable, of } from 'rxjs';
import {
  Contributor,
  ContributorSelection,
  Eligibility,
  Faq,
  IbanUpdate,
  InitiativeMember,
  InitiativeRequest,
  RequestLine,
  SelectionStrategy,
} from './initiative.models';
import banks from './mock/banks.json';
import ibanUpdates from './mock/dashboard-iban-updates.json';
import members from './mock/dashboard-members.json';
import requests from './mock/dashboard-requests.json';
import eligibility from './mock/eligibility.json';
import eligibleContributors from './mock/eligible-contributors.json';
import faqs from './mock/faqs.json';
import { generateContributors, generateMembers } from './mock/large-data';

/**
 * Mock only: extra generated contributors, for testing the tables and pagination with large lists.
 * Set to 0 to use only the JSON mock. With it on, the establishment limit is 60% of all contributors.
 */
const MOCK_EXTRA_CONTRIBUTORS = 600;

/** Adds months, staying in the target month: Nov 30 + 3 months → Feb 28, not Mar 2. */
export function addMonths(date: Date, months: number): Date {
  const result = new Date(date.getFullYear(), date.getMonth() + months, 1);
  const daysInMonth = new Date(result.getFullYear(), result.getMonth() + 1, 0).getDate();
  result.setDate(Math.min(date.getDate(), daysInMonth));
  return result;
}

/**
 * The initiative API — MOCK.
 * Reads come from the JSON files in ./mock; writes are kept in memory, standing in for the backend.
 * Set "enrolled" in mock/eligibility.json to true to start on the dashboard with the mock/dashboard-*.json data.
 * To go live, replace each method body with the HttpClient call (marked TODO); the signatures stay the same.
 * Only InitiativeScComponent calls this.
 */
@Injectable()
export class InitiativeApiService {
  /** Simulated network delay, so loading states get exercised */
  latencyMs = 300;

  // In-memory "backend" state
  private contributors: Contributor[] = [...structuredClone(eligibleContributors), ...generateContributors(MOCK_EXTRA_CONTRIBUTORS)];
  private maxContributors = MOCK_EXTRA_CONTRIBUTORS > 0 ? Math.round(this.contributors.length * 0.6) : eligibility.maxContributors;
  private members: InitiativeMember[] = [];
  private requests: InitiativeRequest[] = [];
  private ibanUpdates: IbanUpdate[] = [];
  /** IBANs saved by the request being built; they go for validation under its ID */
  private pendingIbanUpdates: Contributor[] = [];

  constructor() {
    if (eligibility.enrolled) {
      this.seedDashboard();
    }
  }

  /** Mock only: start with the dashboard sample data, as an establishment that has already enrolled */
  seedDashboard(): void {
    this.members = [...structuredClone(members), ...generateMembers(generateContributors(MOCK_EXTRA_CONTRIBUTORS))];
    this.requests = structuredClone(requests) as InitiativeRequest[];
    this.ibanUpdates = structuredClone(ibanUpdates);
  }

  // TODO: GET establishment eligibility
  getEligibility(): Observable<Eligibility> {
    // Once a request has been sent, the establishment is enrolled
    return this.respond(() => ({ ...eligibility, maxContributors: this.maxContributors, enrolled: this.requests.length > 0 }));
  }

  // TODO: GET initiative FAQs
  getFaqs(): Observable<Faq[]> {
    return this.respond(() => faqs);
  }

  // TODO: GET eligible contributors
  getEligibleContributors(): Observable<Contributor[]> {
    return this.respond(() => this.contributors);
  }

  /** The contributors a strategy picks, up to the establishment limit. */
  // TODO: GET contributors prepared by strategy
  getStrategySelection(strategy: SelectionStrategy): Observable<Contributor[]> {
    if (strategy === 'custom') {
      return this.respond(() => []);
    }
    const sorted = [...this.contributors].sort((a, b) => {
      if (strategy === 'highest') return b.benefitAmount - a.benefitAmount;
      if (strategy === 'lowest') return a.wage - b.wage;
      return a.joiningDate.localeCompare(b.joiningDate);
    });
    return this.respond(() => sorted.slice(0, this.maxContributors));
  }

  /** Empty when the IBAN isn't recognised */
  // TODO: GET bank by IBAN
  getBankName(iban: string): Observable<string> {
    return this.respond(() => this.bankOf(iban));
  }

  // TODO: POST the application
  submitApplication(selection: ContributorSelection): Observable<InitiativeRequest> {
    return this.respond(() => this.addMembers(selection.contributors));
  }

  // TODO: POST contributors to add
  addContributors(contributors: Contributor[]): Observable<InitiativeRequest> {
    return this.respond(() => this.addMembers(contributors));
  }

  // TODO: POST contributors to remove
  removeContributors(removed: InitiativeMember[]): Observable<InitiativeRequest> {
    return this.respond(() => this.removeMembers(removed.map((m) => m.nnid)));
  }

  // TODO: GET requests
  getRequests(): Observable<InitiativeRequest[]> {
    return this.respond(() => this.requests);
  }

  // TODO: GET initiative contributors
  getMembers(): Observable<InitiativeMember[]> {
    return this.respond(() => this.members);
  }

  // TODO: GET IBAN updates
  getIbanUpdates(): Observable<IbanUpdate[]> {
    return this.respond(() => this.ibanUpdates);
  }

  /* ===== Mock backend ===== */

  /**
   * Like an HTTP call: nothing runs until it's subscribed to (so an unsent request changes nothing),
   * and the response is a copy, so callers can't change the "backend" state by mutating it.
   */
  private respond<T>(handle: () => T): Observable<T> {
    const response = defer(() => of(structuredClone(handle())));
    return this.latencyMs > 0 ? response.pipe(delay(this.latencyMs)) : response;
  }

  private addMembers(added: Contributor[]): InitiativeRequest {
    // Store IBANs the user entered, filling in what the backend would derive from them
    const contributors = added.map((c) => this.saveIban(c));
    const [benefitStart, benefitEnd] = this.benefitPeriod();
    const request = this.addRequest(contributors.map((contributor) => ({ contributor, action: 'added', benefitStart, benefitEnd })));
    this.members = [...this.members, ...contributors.map((c) => ({ ...c, requestId: request.transactionId, benefitStart, benefitEnd }))];
    return request;
  }

  private removeMembers(ids: string[]): InitiativeRequest {
    const request = this.addRequest(
      this.members
        .filter((m) => ids.includes(m.nnid))
        .map((m) => ({ contributor: m, action: 'removed', benefitStart: m.benefitStart, benefitEnd: m.benefitEnd })),
    );
    this.members = this.members.filter((m) => !ids.includes(m.nnid));
    return request;
  }

  private saveIban(contributor: Contributor): Contributor {
    const stored = this.contributors.find((c) => c.nnid === contributor.nnid);
    if (!contributor.iban || contributor.iban === stored?.iban) {
      return stored ?? contributor;
    }
    const iban = contributor.iban.replace(/\s+/g, '').toUpperCase();
    const updated: Contributor = {
      ...contributor,
      iban,
      maskedIban: `${iban.slice(0, 6)}*********${iban.slice(-4)}`,
      bankName: this.bankOf(iban),
    };
    this.contributors = this.contributors.map((c) => (c.nnid === updated.nnid ? updated : c));
    this.pendingIbanUpdates.push(updated);
    return updated;
  }

  /** Saudi IBANs carry the bank code after the check digits: SA03 80… → 80 */
  private bankOf(iban: string): string {
    return (banks as Record<string, string>)[iban.replace(/\s+/g, '').toUpperCase().slice(4, 6)] ?? '';
  }

  private addRequest(lines: RequestLine[]): InitiativeRequest {
    const request: InitiativeRequest = {
      transactionId: String(Math.floor(1_000_000_000 + Math.random() * 9_000_000_000)),
      date: formatDate(new Date(), 'dd/MM/yyyy', 'en-US'),
      status: 'under-review',
      lines,
    };
    this.requests = [request, ...this.requests];
    this.ibanUpdates = [...this.pendingIbanUpdates.map((contributor) => ({ contributor, requestId: request.transactionId })), ...this.ibanUpdates];
    this.pendingIbanUpdates = [];
    return request;
  }

  /** The design shows a three-month benefit period starting today */
  private benefitPeriod(): [string, string] {
    const start = new Date();
    return [formatDate(start, 'yyyy/MM/dd', 'en-US'), formatDate(addMonths(start, 3), 'yyyy/MM/dd', 'en-US')];
  }
}
