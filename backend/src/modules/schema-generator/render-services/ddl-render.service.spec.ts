import { Test, TestingModule } from '@nestjs/testing';
import { DdlRenderService } from './ddl-render.service';
import { ddlRenderResultFixture, nlpResultFixture } from 'src/shared/fixtures';

describe('DdlRenderService', () => {
  let service: DdlRenderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DdlRenderService],
    }).compile();

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
