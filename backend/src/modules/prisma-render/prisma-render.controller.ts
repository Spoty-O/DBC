import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PrismaRenderService } from './prisma-render.service';
import { CreatePrismaRenderDto } from './dto/create-prisma-render.dto';
import { UpdatePrismaRenderDto } from './dto/update-prisma-render.dto';

@Controller('prisma-render')
export class PrismaRenderController {
  constructor(private readonly prismaRenderService: PrismaRenderService) {}

  @Post()
  create(@Body() createPrismaRenderDto: CreatePrismaRenderDto) {
    return this.prismaRenderService.create(createPrismaRenderDto);
  }

  @Get()
  findAll() {
    return this.prismaRenderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.prismaRenderService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePrismaRenderDto: UpdatePrismaRenderDto) {
    return this.prismaRenderService.update(+id, updatePrismaRenderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.prismaRenderService.remove(+id);
  }
}
