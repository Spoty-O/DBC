import { Inject, Injectable } from '@nestjs/common';
import { CreateSchemaDto } from './dto';
import { TRenderMap } from 'src/shared/types';
import { NLP_SERVICE, RENDER_REGISTRY } from 'src/shared/constants';
import { INlpService } from 'src/shared/interfaces';

@Injectable()
export class SchemaGeneratorService {
  constructor(
    @Inject(NLP_SERVICE) private readonly parser: INlpService,
    @Inject(RENDER_REGISTRY) private readonly rendersMap: TRenderMap,
  ) {}

  async create(body: CreateSchemaDto) {
    const schemaObj = await this.parser.parseTemplateText(body.text);
    const query = this.rendersMap.ddlRenderService.render(schemaObj);
    return query;
  }
}
