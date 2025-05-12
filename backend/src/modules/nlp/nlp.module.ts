import { Module } from '@nestjs/common';
import { NlpService } from './nlp.service';

@Module({
  controllers: [],
  providers: [NlpService],
})
export class NlpModule {}
