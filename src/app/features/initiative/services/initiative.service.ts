import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MOCK_CONTRIBUTORS, MOCK_ESTABLISHMENT, MOCK_FAQS } from './initiative.mock';
import { Contributor, Establishment, Faq } from '../initiative.models';

function mockResponse<T>(value: T): Observable<T> {
  return of(value);
}

/**
 * API layer for the initiative. Only InitiativeScComponent calls this.
 *
 * TODO: replace each mock with an HttpClient call to the real endpoint
 * (and add provideHttpClient() to the app config).
 */
@Injectable()
export class InitiativeService {
  /** Stands in for the server's record of added contributors until the real API exists. */
  private addedNnids = new Set<string>();

  getFaqs(): Observable<Faq[]> {
    return mockResponse(MOCK_FAQS);
  }

  getEstablishment(): Observable<Establishment> {
    return mockResponse(MOCK_ESTABLISHMENT);
  }

  getMaxContributors(): Observable<number> {
    return mockResponse(600);
  }

  submitApplication(registrationNumber: string): Observable<void> {
    void registrationNumber;
    return mockResponse(undefined);
  }

  /** Contributors already added to the initiative. */
  getContributors(): Observable<Contributor[]> {
    return mockResponse(MOCK_CONTRIBUTORS.filter((c) => this.addedNnids.has(c.nnid)));
  }

  /** Every contributor of the establishment, eligible or not. */
  getCandidates(): Observable<Contributor[]> {
    return mockResponse(MOCK_CONTRIBUTORS);
  }

  /** Replaces the added contributors with `nnids` and returns the saved list. */
  saveContributors(nnids: string[]): Observable<Contributor[]> {
    this.addedNnids = new Set(nnids);
    return this.getContributors();
  }

  removeContributor(nnid: string): Observable<void> {
    this.addedNnids.delete(nnid);
    return mockResponse(undefined);
  }
}
