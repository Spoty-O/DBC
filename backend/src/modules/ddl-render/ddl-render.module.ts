import { Module } from '@nestjs/common';
import { DdlRenderService } from './ddl-render.service';

@Module({
  providers: [DdlRenderService],
  exports: [DdlRenderService],
})
export class DdlRenderModule {}
