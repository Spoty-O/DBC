import { Module, Provider } from '@nestjs/common';
import { SchemaGeneratorService } from './schema-generator.service';
import { SchemaGeneratorController } from './schema-generator.controller';
import { NlpModule } from '../nlp/nlp.module';
import { RENDER_TOKEN } from 'src/shared/constants';
import { IRenderService } from 'src/shared/interfaces';
import { TRenderMap } from 'src/shared/types';
import { DdlRenderService } from './render-services';

const RenderProvider: Provider = {
  provide: RENDER_TOKEN,
  useFactory: (ddlRender: IRenderService): TRenderMap => ({ MySQL: ddlRender }),
  inject: [DdlRenderService],
};

@Module({
  imports: [NlpModule],
  controllers: [SchemaGeneratorController],
  providers: [SchemaGeneratorService, DdlRenderService, RenderProvider],
})
export class SchemaGeneratorModule {}
