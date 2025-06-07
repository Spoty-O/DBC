import { Injectable } from '@nestjs/common';
import { CreateMongooseRenderDto } from './dto/create-mongoose-render.dto';
import { UpdateMongooseRenderDto } from './dto/update-mongoose-render.dto';

@Injectable()
export class MongooseRenderService {
  create(createMongooseRenderDto: CreateMongooseRenderDto) {
    return 'This action adds a new mongooseRender';
  }

  findAll() {
    return `This action returns all mongooseRender`;
  }

  findOne(id: number) {
    return `This action returns a #${id} mongooseRender`;
  }

  update(id: number, updateMongooseRenderDto: UpdateMongooseRenderDto) {
    return `This action updates a #${id} mongooseRender`;
  }

  remove(id: number) {
    return `This action removes a #${id} mongooseRender`;
  }
}
