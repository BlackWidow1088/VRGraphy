/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RendererService } from './renderer.service';

describe('Service: Renderer', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RendererService]
    });
  });

  it('should ...', inject([RendererService], (service: RendererService) => {
    expect(service).toBeTruthy();
  }));
});
