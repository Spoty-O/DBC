import { Module } from '@nestjs/common';
import { NlpService } from './nlp.service';
import { NLP_SERVICE } from 'src/shared/constants';

@Module({
  providers: [{ provide: NLP_SERVICE, useClass: NlpService }],
  exports: [NLP_SERVICE],
})
export class NlpModule {}
