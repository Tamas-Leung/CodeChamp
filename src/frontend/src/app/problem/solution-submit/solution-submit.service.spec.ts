import { TestBed } from '@angular/core/testing';

import { SolutionSubmitService } from './solution-submit.service';

describe('SolutionSubmitService', () => {
  let service: SolutionSubmitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SolutionSubmitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
