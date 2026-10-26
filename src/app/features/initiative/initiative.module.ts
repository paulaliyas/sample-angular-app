import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  AboutInitiativeDcComponent,
  AddContributorsDcComponent,
  ContributorSearchDcComponent,
  ContributorsDcComponent,
  EstablishmentDetailsDcComponent,
  InitiativeScComponent,
  RiyalIconDcComponent,
} from './components';
import { InitiativeDcComponent } from './initiative-dc.component';
import { InitiativeRoutingModule } from './initiative-routing.module';
import { InitiativeService } from './services';

@NgModule({
  declarations: [
    InitiativeDcComponent,
    InitiativeScComponent,
    AboutInitiativeDcComponent,
    EstablishmentDetailsDcComponent,
    ContributorsDcComponent,
    AddContributorsDcComponent,
    ContributorSearchDcComponent,
    RiyalIconDcComponent,
  ],
  imports: [CommonModule, InitiativeRoutingModule],
  providers: [InitiativeService],
})
export class InitiativeModule {}
