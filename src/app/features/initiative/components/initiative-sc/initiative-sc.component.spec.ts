import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { InitiativeModule } from '../../initiative.module';
import { InitiativeScComponent } from './initiative-sc.component';

describe('InitiativeScComponent', () => {
  let component: InitiativeScComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [InitiativeModule],
      providers: [provideRouter([])],
    });
    const fixture = TestBed.createComponent(InitiativeScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('starts on the about step', () => {
    expect(component.step).toBe('about');
  });

  it('moves to the next step on each save', () => {
    component.onApply();
    expect(component.step).toBe('establishment');

    component.onSaveApplication();
    expect(component.step).toBe('contributors');

    component.onManageContributors();
    expect(component.step).toBe('add-contributors');

    const picked = component.allContributors.slice(0, 2);
    component.onSaveContributors(picked);
    expect(component.step).toBe('contributors');
    expect(component.addedContributors).toEqual(picked);

    component.onRemoveContributor(picked[0]);
    expect(component.addedContributors).toEqual([picked[1]]);
  });
});
