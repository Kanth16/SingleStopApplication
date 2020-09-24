import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinterComponent } from './linter.component';

describe('LinterComponent', () => {
  let component: LinterComponent;
  let fixture: ComponentFixture<LinterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
