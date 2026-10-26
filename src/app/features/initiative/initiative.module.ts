import { NgModule } from '@angular/core';
import { InitiativeComponentsModule } from './components';
import { InitiativeDcComponent } from './initiative-dc.component';
import { InitiativeRoutingModule } from './initiative-routing.module';

@NgModule({
  declarations: [InitiativeDcComponent],
  imports: [InitiativeComponentsModule, InitiativeRoutingModule],
})
export class InitiativeModule {}
