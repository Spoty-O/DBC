import { Test, TestingModule } from '@nestjs/testing';
import { PrismaRenderService } from './prisma-render.service';

describe('PrismaRenderService', () => {
  let service: PrismaRenderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaRenderService],
    }).compile();

    service = module.get<PrismaRenderService>(PrismaRenderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
