import { Injectable } from '@nestjs/common';
import Groq from 'groq-sdk';
import { CConfigService } from '../config/service';

@Injectable()
export class GroqService {
  private readonly client: Groq;
  private readonly model: string;

  constructor(private readonly configService: CConfigService) {
    this.client = new Groq({
      apiKey: configService.GROQ_API_KEY,
    });

    this.model = configService.GROQ_MODEL;
  }

  async generateText(system: string, user: string): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: this.model,
      temperature: 0.1,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    });

    return response.choices[0]?.message?.content ?? '';
  }
}
