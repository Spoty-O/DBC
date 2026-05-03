import { Module } from '@nestjs/common';
import { GenerateModule } from './modules/generate/generate.module';
import { CConfigModule } from '../config/env.config';

@Module({
  imports: [CConfigModule, GenerateModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
