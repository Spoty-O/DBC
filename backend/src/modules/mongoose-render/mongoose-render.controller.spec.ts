import { Test, TestingModule } from '@nestjs/testing';
import { MongooseRenderController } from './mongoose-render.controller';
import { MongooseRenderService } from './mongoose-render.service';

describe('MongooseRenderController', () => {
  let controller: MongooseRenderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MongooseRenderController],
      providers: [MongooseRenderService],
    }).compile();

    controller = module.get<MongooseRenderController>(MongooseRenderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
