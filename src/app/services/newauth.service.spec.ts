import { TestBed } from '@angular/core/testing';

import { NewauthService } from './newauth.service';

describe('NewauthService', () => {
  let service: NewauthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewauthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
