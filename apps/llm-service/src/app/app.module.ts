import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CConfigService } from '../config/service';
import { GroqService } from './groq.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, CConfigService, GroqService],
})
export class AppModule {}
