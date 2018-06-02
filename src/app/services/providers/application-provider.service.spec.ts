import { TestBed, inject } from '@angular/core/testing';

import { ApplicationProviderService } from './application-provider.service';

describe('ApplicationProviderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApplicationProviderService]
    });
  });

  it('should be created', inject([ApplicationProviderService], (service: ApplicationProviderService) => {
    expect(service).toBeTruthy();
  }));
});
