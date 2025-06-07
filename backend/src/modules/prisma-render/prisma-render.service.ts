import { Injectable } from '@nestjs/common';
import { CreatePrismaRenderDto } from './dto/create-prisma-render.dto';
import { UpdatePrismaRenderDto } from './dto/update-prisma-render.dto';

@Injectable()
export class PrismaRenderService {
  create(createPrismaRenderDto: CreatePrismaRenderDto) {
    return 'This action adds a new prismaRender';
  }

  findAll() {
    return `This action returns all prismaRender`;
  }

  findOne(id: number) {
    return `This action returns a #${id} prismaRender`;
  }

  update(id: number, updatePrismaRenderDto: UpdatePrismaRenderDto) {
    return `This action updates a #${id} prismaRender`;
  }

  remove(id: number) {
    return `This action removes a #${id} prismaRender`;
  }
}
