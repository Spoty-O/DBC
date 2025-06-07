import { Provider } from '@nestjs/common';
import { RENDER_REGISTRY } from 'src/shared/constants';
import { TRenderMap } from 'src/shared/types';
import { DdlRenderService } from '../ddl-render/ddl-render.service';

export const RendersRegistryProvider: Provider = {
  provide: RENDER_REGISTRY,
  useFactory: (ddlRenderService: DdlRenderService): TRenderMap => ({
    ddlRenderService,
  }),
  inject: [DdlRenderService],
};
