import { Module } from '@nestjs/common';
import { TypeOrmRenderService } from './type-orm-render.service';
import { TypeOrmRenderController } from './type-orm-render.controller';

@Module({
  controllers: [TypeOrmRenderController],
  providers: [TypeOrmRenderService],
})
export class TypeOrmRenderModule {}
