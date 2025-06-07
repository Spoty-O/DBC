import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TypeOrmRenderService } from './type-orm-render.service';
import { CreateTypeOrmRenderDto } from './dto/create-type-orm-render.dto';
import { UpdateTypeOrmRenderDto } from './dto/update-type-orm-render.dto';

@Controller('type-orm-render')
export class TypeOrmRenderController {
  constructor(private readonly typeOrmRenderService: TypeOrmRenderService) {}

  @Post()
  create(@Body() createTypeOrmRenderDto: CreateTypeOrmRenderDto) {
    return this.typeOrmRenderService.create(createTypeOrmRenderDto);
  }

  @Get()
  findAll() {
    return this.typeOrmRenderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.typeOrmRenderService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTypeOrmRenderDto: UpdateTypeOrmRenderDto) {
    return this.typeOrmRenderService.update(+id, updateTypeOrmRenderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.typeOrmRenderService.remove(+id);
  }
}
