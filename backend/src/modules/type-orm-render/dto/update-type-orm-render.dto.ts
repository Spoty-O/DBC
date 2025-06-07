import { PartialType } from '@nestjs/swagger';
import { CreateTypeOrmRenderDto } from './create-type-orm-render.dto';

export class UpdateTypeOrmRenderDto extends PartialType(CreateTypeOrmRenderDto) {}
