import { Module } from '@nestjs/common';
import { NlpService } from './nlp.service';
import { ErrorService } from '../error/error.service';

@Module({
  imports: [ErrorService],
  controllers: [],
  providers: [NlpService],
})
export class NlpModule {}
