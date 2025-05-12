import { Injectable } from '@nestjs/common';
import { ITableSchema } from 'src/shared/interfaces/nlp.interface';

@Injectable()
export class NlpService {
  public parseTemplateText(text: string): ITableSchema {}
}
