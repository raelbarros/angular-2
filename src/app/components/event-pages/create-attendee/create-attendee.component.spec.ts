import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAttendeeComponent } from './create-attendee.component';

describe('AttendeesComponent', () => {
  let component: CreateAttendeeComponent;
  let fixture: ComponentFixture<CreateAttendeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateAttendeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAttendeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
