import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { TCharacter } from 'types';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('schema.generate')
  async generate(
    @Payload()
    dto: {
      text: string;
      character: TCharacter;
    },
  ) {
    return this.appService.generate(dto.text, dto.character ?? 'none');
  }
}
