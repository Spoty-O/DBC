import { PartialType } from '@nestjs/swagger';
import { CreatePrismaRenderDto } from './create-prisma-render.dto';

export class UpdatePrismaRenderDto extends PartialType(CreatePrismaRenderDto) {}
