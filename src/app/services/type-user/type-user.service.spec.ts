import { TestBed, inject } from '@angular/core/testing';

import { typeUser } from './type-user.service';

describe('TypeUserService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [typeUser]
    });
  });

  it('should be created', inject([typeUser], (service: typeUser) => {
    expect(service).toBeTruthy();
  }));
});
