import { Module } from '@nestjs/common';
import { MongooseRenderService } from './mongoose-render.service';
import { MongooseRenderController } from './mongoose-render.controller';

@Module({
  controllers: [MongooseRenderController],
  providers: [MongooseRenderService],
})
export class MongooseRenderModule {}
