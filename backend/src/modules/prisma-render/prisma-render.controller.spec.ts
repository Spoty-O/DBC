import { Test, TestingModule } from '@nestjs/testing';
import { PrismaRenderController } from './prisma-render.controller';
import { PrismaRenderService } from './prisma-render.service';

describe('PrismaRenderController', () => {
  let controller: PrismaRenderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrismaRenderController],
      providers: [PrismaRenderService],
    }).compile();

    controller = module.get<PrismaRenderController>(PrismaRenderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
