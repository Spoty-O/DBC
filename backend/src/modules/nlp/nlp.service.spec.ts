import { TestBed } from '@suites/unit';
import { NlpService } from './nlp.service';
import { nlpInputFixture, nlpOutputFixture } from 'src/shared/fixtures';

describe('NlpService (Unit)', () => {
  let service: NlpService;

  beforeEach(async () => {
    const { unit } = await TestBed.solitary(NlpService).compile();

    service = unit;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('parseTemplateText: returns ITableSchema[] when valid', async () => {
    await expect(
      service.parseTemplateText(nlpInputFixture),
    ).resolves.toStrictEqual(nlpOutputFixture);
  });
});
