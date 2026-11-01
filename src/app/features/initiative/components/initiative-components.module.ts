import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AddContributorsDcComponent } from './add-contributors-dc/add-contributors-dc.component';
import { AddMissingIbanDcComponent } from './add-missing-iban-dc/add-missing-iban-dc.component';
import { ApplyDcComponent } from './apply-dc/apply-dc.component';
import { BankAccountDcComponent } from './bank-account-dc/bank-account-dc.component';
import { ChooseContributorsDcComponent } from './choose-contributors-dc/choose-contributors-dc.component';
import { HowItWorksDcComponent } from './how-it-works-dc/how-it-works-dc.component';
import { IbanUpdateDcComponent } from './iban-update-dc/iban-update-dc.component';
import { IconDcComponent } from './icon-dc/icon-dc.component';
import { InitiativeApiService } from './initiative-api.service';
import { InitiativeScComponent } from './initiative-sc/initiative-sc.component';
import { ManageContributorsDcComponent } from './manage-contributors-dc/manage-contributors-dc.component';
import { PaginationDcComponent } from './pagination-dc/pagination-dc.component';
import { RequestSummaryDcComponent } from './request-summary-dc/request-summary-dc.component';
import { RequestsDcComponent } from './requests-dc/requests-dc.component';

/**
 * Everything the initiative components need, in one module.
 * To reuse this folder in another app, import this module and add <app-initiative-sc></app-initiative-sc>.
 */
@NgModule({
  declarations: [
    InitiativeScComponent,
    // Application steps
    ApplyDcComponent,
    ChooseContributorsDcComponent,
    BankAccountDcComponent,
    RequestSummaryDcComponent,
    // Dashboard tabs and drawers
    RequestsDcComponent,
    ManageContributorsDcComponent,
    IbanUpdateDcComponent,
    AddContributorsDcComponent,
    AddMissingIbanDcComponent,
    // Shared
    HowItWorksDcComponent,
    PaginationDcComponent,
    IconDcComponent,
  ],
  imports: [CommonModule, FormsModule],
  // TODO: the mock API — swap for the real implementation
  providers: [InitiativeApiService],
  exports: [InitiativeScComponent],
})
export class InitiativeComponentsModule {}
