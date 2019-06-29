import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalRouteComponent } from './local-route.component';

describe('LocalRouteComponent', () => {
  let component: LocalRouteComponent;
  let fixture: ComponentFixture<LocalRouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalRouteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
