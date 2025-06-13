import { Inject, Injectable } from '@nestjs/common';
import { CreateSchemaDto } from './dto';
import { TRenderMap } from 'src/shared/types';
import { RENDER_TOKEN } from 'src/shared/constants';
import { NlpService } from '../nlp/nlp.service';

@Injectable()
export class SchemaGeneratorService {
  constructor(
    private readonly parser: NlpService,
    @Inject(RENDER_TOKEN) private readonly renderMap: TRenderMap,
  ) {}

  async create(body: CreateSchemaDto) {
    const schemaObj = await this.parser.parseTemplateText(body.text);
    const query = this.renderMap[body.type].render(schemaObj);
    return query;
  }
}
