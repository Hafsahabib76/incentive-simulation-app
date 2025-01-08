import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncentiveSimulationComponent } from './incentive-simulation.component';

describe('IncentiveSimulationComponent', () => {
  let component: IncentiveSimulationComponent;
  let fixture: ComponentFixture<IncentiveSimulationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IncentiveSimulationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncentiveSimulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
