import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { InitiativeService, MOCK_CONTRIBUTORS, MOCK_ESTABLISHMENT, MOCK_FAQS } from '../../services';
import { InitiativeModule } from '../../initiative.module';
import { InitiativeScComponent } from './initiative-sc.component';

describe('InitiativeScComponent', () => {
  const added = MOCK_CONTRIBUTORS.slice(0, 2);
  const api = {
    getFaqs: () => of(MOCK_FAQS),
    getEstablishment: () => of(MOCK_ESTABLISHMENT),
    getMaxContributors: () => of(600),
    submitApplication: () => of(undefined),
    getContributors: () => of([]),
    getCandidates: () => of(MOCK_CONTRIBUTORS),
    saveContributors: () => of(added),
    removeContributor: () => of(undefined),
  };

  function create() {
    TestBed.configureTestingModule({
      imports: [InitiativeModule],
      providers: [provideRouter([]), { provide: InitiativeService, useValue: api }],
    });
    const fixture = TestBed.createComponent(InitiativeScComponent);
    fixture.detectChanges();
    return fixture.componentInstance;
  }

  it('starts on the about step with the FAQs loaded', () => {
    const sc = create();
    expect(sc.step()).toBe('about');
    expect(sc.faqs().length).toBe(MOCK_FAQS.length);
  });

  it('walks through each step on save & next', () => {
    const sc = create();

    sc.onApply();
    expect(sc.step()).toBe('establishment');
    expect(sc.establishment()).toEqual(MOCK_ESTABLISHMENT);

    sc.onSaveApplication();
    expect(sc.step()).toBe('establishment'); // declaration not accepted yet

    sc.declarationAccepted.set(true);
    sc.onSaveApplication();
    expect(sc.step()).toBe('contributors');

    sc.onManageContributors();
    expect(sc.step()).toBe('add-contributors');
    expect(sc.maxContributors()).toBe(600);

    sc.onSaveContributors(added.map((c) => c.nnid));
    expect(sc.step()).toBe('contributors');
    expect(sc.contributors()).toEqual(added);

    sc.onRemoveContributor(added[0]);
    expect(sc.contributors()).toEqual([added[1]]);
  });
});
