import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddModulesComponent } from './add-modules.component';

describe('AddModulesComponent', () => {
  let component: AddModulesComponent;
  let fixture: ComponentFixture<AddModulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddModulesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddModulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
