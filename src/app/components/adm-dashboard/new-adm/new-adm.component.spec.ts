import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAdmComponent } from './new-adm.component';

describe('NewAdmComponent', () => {
  let component: NewAdmComponent;
  let fixture: ComponentFixture<NewAdmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewAdmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewAdmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
