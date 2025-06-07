import { Injectable } from '@nestjs/common';
import { CreateTypeOrmRenderDto } from './dto/create-type-orm-render.dto';
import { UpdateTypeOrmRenderDto } from './dto/update-type-orm-render.dto';

@Injectable()
export class TypeOrmRenderService {
  create(createTypeOrmRenderDto: CreateTypeOrmRenderDto) {
    return 'This action adds a new typeOrmRender';
  }

  findAll() {
    return `This action returns all typeOrmRender`;
  }

  findOne(id: number) {
    return `This action returns a #${id} typeOrmRender`;
  }

  update(id: number, updateTypeOrmRenderDto: UpdateTypeOrmRenderDto) {
    return `This action updates a #${id} typeOrmRender`;
  }

  remove(id: number) {
    return `This action removes a #${id} typeOrmRender`;
  }
}
