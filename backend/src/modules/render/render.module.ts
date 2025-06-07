import { Module } from '@nestjs/common';
import { DdlRenderModule } from '../ddl-render/ddl-render.module';
import { RendersRegistryProvider } from './render.provider';

@Module({
  imports: [DdlRenderModule],
  providers: [RendersRegistryProvider],
  exports: [RendersRegistryProvider],
})
export class RenderModule {}
