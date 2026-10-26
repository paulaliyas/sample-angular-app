import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AboutInitiativeDcComponent } from './about-initiative-dc/about-initiative-dc.component';
import { AddContributorsDcComponent } from './add-contributors-dc/add-contributors-dc.component';
import { ContributorsDcComponent } from './contributors-dc/contributors-dc.component';
import { EstablishmentDetailsDcComponent } from './establishment-details-dc/establishment-details-dc.component';
import { InitiativeScComponent } from './initiative-sc/initiative-sc.component';

/**
 * Everything the initiative components need, in one module.
 * To reuse this folder in another app, import this module and add <app-initiative-sc></app-initiative-sc>.
 */
@NgModule({
  declarations: [
    InitiativeScComponent,
    AboutInitiativeDcComponent,
    EstablishmentDetailsDcComponent,
    ContributorsDcComponent,
    AddContributorsDcComponent,
  ],
  imports: [CommonModule, FormsModule],
  exports: [InitiativeScComponent],
})
export class InitiativeComponentsModule {}
