import { PartialType } from '@nestjs/swagger';
import { CreateMongooseRenderDto } from './create-mongoose-render.dto';

export class UpdateMongooseRenderDto extends PartialType(CreateMongooseRenderDto) {}
