import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MongooseRenderService } from './mongoose-render.service';
import { CreateMongooseRenderDto } from './dto/create-mongoose-render.dto';
import { UpdateMongooseRenderDto } from './dto/update-mongoose-render.dto';

@Controller('mongoose-render')
export class MongooseRenderController {
  constructor(private readonly mongooseRenderService: MongooseRenderService) {}

  @Post()
  create(@Body() createMongooseRenderDto: CreateMongooseRenderDto) {
    return this.mongooseRenderService.create(createMongooseRenderDto);
  }

  @Get()
  findAll() {
    return this.mongooseRenderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mongooseRenderService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMongooseRenderDto: UpdateMongooseRenderDto) {
    return this.mongooseRenderService.update(+id, updateMongooseRenderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mongooseRenderService.remove(+id);
  }
}
