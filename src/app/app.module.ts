import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { NgxChartsModule } from '@swimlane/ngx-charts'; // Import NgxChartsModule
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IncentiveSimulationComponent } from './incentive-simulation/incentive-simulation.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    IncentiveSimulationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxChartsModule,
    BrowserAnimationsModule,
    HttpClientModule
  ],
  providers: [
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
