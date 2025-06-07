import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmRenderService } from './type-orm-render.service';

describe('TypeOrmRenderService', () => {
  let service: TypeOrmRenderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TypeOrmRenderService],
    }).compile();

    service = module.get<TypeOrmRenderService>(TypeOrmRenderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
