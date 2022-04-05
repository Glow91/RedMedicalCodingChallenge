import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { SearchModule, SearchFacadeService } from '@red-probeaufgabe/search';
import { UiModule } from '@red-probeaufgabe/ui';

@NgModule({
  declarations: [DashboardComponent],
  imports: [CommonModule, UiModule, SearchModule, DashboardRoutingModule],
  // Add the service to the providers
  providers: [SearchFacadeService],
  exports: [DashboardComponent],
})
export class DashboardModule {}
