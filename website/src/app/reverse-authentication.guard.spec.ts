import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { reverseAuthenticationGuard } from './reverse-authentication.guard';

describe('reverseAuthenticationGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => reverseAuthenticationGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
