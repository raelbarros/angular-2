import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAttendeeComponent } from './edit-attendee.component';

describe('EditAttendeeComponent', () => {
  let component: EditAttendeeComponent;
  let fixture: ComponentFixture<EditAttendeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAttendeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAttendeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
