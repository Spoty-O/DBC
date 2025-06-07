import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmRenderController } from './type-orm-render.controller';
import { TypeOrmRenderService } from './type-orm-render.service';

describe('TypeOrmRenderController', () => {
  let controller: TypeOrmRenderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TypeOrmRenderController],
      providers: [TypeOrmRenderService],
    }).compile();

    controller = module.get<TypeOrmRenderController>(TypeOrmRenderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
