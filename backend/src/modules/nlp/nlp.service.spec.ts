import { Test, TestingModule } from '@nestjs/testing';
import { NlpService } from './nlp.service';
import { ErrorService } from '../error/error.service';
import { errorServiceMock } from 'src/shared/mocks/error.mock';
import { simpleFixture, simpleResultFixture } from 'src/shared/fixtures';

describe('NlpService', () => {
  let service: NlpService;
  let errorService: ErrorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NlpService,
        { provide: ErrorService, useValue: errorServiceMock },
      ],
    }).compile();

    errorService = module.get(ErrorService);
    service = module.get<NlpService>(NlpService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('should be parsed', () => {
    expect(service.parseTemplateText(simpleFixture)).toStrictEqual([
      simpleResultFixture,
    ]);
  });
});
