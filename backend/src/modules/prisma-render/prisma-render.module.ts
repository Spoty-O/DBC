import { Module } from '@nestjs/common';
import { PrismaRenderService } from './prisma-render.service';
import { PrismaRenderController } from './prisma-render.controller';

@Module({
  controllers: [PrismaRenderController],
  providers: [PrismaRenderService],
})
export class PrismaRenderModule {}
