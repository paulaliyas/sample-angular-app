import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  AboutInitiativeDcComponent,
  AddContributorsDcComponent,
  ContributorsDcComponent,
  EstablishmentDetailsDcComponent,
  InitiativeScComponent,
} from './components';
import { InitiativeDcComponent } from './initiative-dc.component';
import { InitiativeRoutingModule } from './initiative-routing.module';

@NgModule({
  declarations: [
    InitiativeDcComponent,
    InitiativeScComponent,
    AboutInitiativeDcComponent,
    EstablishmentDetailsDcComponent,
    ContributorsDcComponent,
    AddContributorsDcComponent,
  ],
  imports: [CommonModule, FormsModule, InitiativeRoutingModule],
})
export class InitiativeModule {}
