import { TestBed, inject } from '@angular/core/testing';

import { AppStrings } from './app-strings.service';

describe('AppStrings', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppStrings]
    });
  });

  it('should be created', inject([AppStrings], (service: AppStrings) => {
    expect(service).toBeTruthy();
  }));
});
