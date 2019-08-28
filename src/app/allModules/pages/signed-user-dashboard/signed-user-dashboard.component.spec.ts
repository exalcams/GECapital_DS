import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignedUserDashboardComponent } from './signed-user-dashboard.component';

describe('SignedUserDashboardComponent', () => {
  let component: SignedUserDashboardComponent;
  let fixture: ComponentFixture<SignedUserDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignedUserDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignedUserDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
