import { TestBed } from '@angular/core/testing';

import { BrokerIntegrationService } from './broker-integration.service';

describe('BrokerIntegrationService', () => {
  let service: BrokerIntegrationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BrokerIntegrationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
