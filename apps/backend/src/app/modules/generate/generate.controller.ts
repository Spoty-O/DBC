import { Body, Controller, Post, UseFilters } from '@nestjs/common';
import type { GenerateRequest, GenerateResponse } from 'types';
import { GenerateRequestDto } from './dto/generate-request.dto';
import { GenerateHttpExceptionFilter } from './generate-http-exception.filter';
import { GenerateService } from './generate.service';

@Controller()
@UseFilters(GenerateHttpExceptionFilter)
export class GenerateController {
  constructor(private readonly generateService: GenerateService) {}

  @Post('generate')
  generate(@Body() dto: GenerateRequestDto): Promise<GenerateResponse> {
    const request: GenerateRequest = {
      text: dto.text,
      resultType: dto.resultType,
    };
    return this.generateService.generate(request);
  }
}
