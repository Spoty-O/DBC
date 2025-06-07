import { Test, TestingModule } from '@nestjs/testing';
import { MongooseRenderService } from './mongoose-render.service';

describe('MongooseRenderService', () => {
  let service: MongooseRenderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MongooseRenderService],
    }).compile();

    service = module.get<MongooseRenderService>(MongooseRenderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
