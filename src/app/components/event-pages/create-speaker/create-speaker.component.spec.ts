import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSpeakersComponent } from './speakers.component';

describe('SpeakersComponent', () => {
  let component: CreateSpeakersComponent;
  let fixture: ComponentFixture<CreateSpeakersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateSpeakersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSpeakersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
