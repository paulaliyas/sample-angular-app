import { CommonModule } from '@angular/common';
import { NgModule, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AddContributorsDcComponent } from './add-contributors-dc/add-contributors-dc.component';
import { AddMissingIbanDcComponent } from './add-missing-iban-dc/add-missing-iban-dc.component';
import { ApplyDcComponent } from './apply-dc/apply-dc.component';
import { TermsDcComponent } from './terms-dc/terms-dc.component';
import { BankAccountDcComponent } from './bank-account-dc/bank-account-dc.component';
import { ChooseContributorsDcComponent } from './choose-contributors-dc/choose-contributors-dc.component';
import { HowItWorksDcComponent } from './how-it-works-dc/how-it-works-dc.component';
import { registerInitiativeTranslations } from './i18n/initiative-translations';
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
 * The host app must provide ngx-translate (provideTranslateService); this module adds its own EN/AR texts
 * and follows the host's current language (TranslateService.use('en' | 'ar')).
 */
@NgModule({
  declarations: [
    InitiativeScComponent,
    // Application steps
    ApplyDcComponent,
    TermsDcComponent,
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
  imports: [CommonModule, FormsModule, TranslatePipe],
  // TODO: the mock API — swap for the real implementation
  providers: [InitiativeApiService],
  exports: [InitiativeScComponent],
})
export class InitiativeComponentsModule {
  constructor() {
    registerInitiativeTranslations(inject(TranslateService));
  }
}
