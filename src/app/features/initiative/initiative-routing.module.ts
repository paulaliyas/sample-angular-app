import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InitiativeScComponent } from './components';
import { InitiativeDcComponent } from './initiative-dc.component';

const routes: Routes = [
  {
    path: '',
    component: InitiativeDcComponent,
    children: [
      {
        path: '',
        component: InitiativeScComponent,
        title: 'Daam Initiative',
        data: {
          breadcrumb: 'INITIATIVE.DAAM',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InitiativeRoutingModule {}
