import { Test, TestingModule } from '@nestjs/testing';
import { DdlRenderService } from './ddl-render.service';
import { ErrorService } from '../../error/error.service';
import { errorServiceMock } from 'src/shared/mocks/error.mock';
import { ddlRenderResultFixture, nlpResultFixture } from 'src/shared/fixtures';

describe('DdlRenderService', () => {
  let service: DdlRenderService;
  let errorService: ErrorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DdlRenderService,
        { provide: ErrorService, useValue: errorServiceMock },
      ],
    }).compile();

    errorService = module.get<ErrorService>(ErrorService);
    service = module.get<DdlRenderService>(DdlRenderService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('should be rendered', async () => {
    await expect(service.render(nlpResultFixture)).resolves.toEqual(
      ddlRenderResultFixture,
    );
  });
});
