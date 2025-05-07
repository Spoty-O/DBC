import {
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
  Body,
} from '@nestjs/common';

import { StaffService } from './staff.service';

import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { GetAllReturnDto, GetByIdReturnDto } from './dto/swagger-examples';
import { CreateDto } from './dto';

@ApiTags('Staff')
@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @ApiResponse({
    status: 200,
    type: GetAllReturnDto,
  })
  @Get('/')
  public async getAll() {
    const staff = await this.staffService.getAll();
    return { staff };
  }

  @ApiResponse({
    status: 200,
    type: GetByIdReturnDto,
  })
  @Get('/:id')
  public async getById(@Param('id') id: string) {
    const staff = await this.staffService.getById(id);
    return { staff };
  }

  @ApiResponse({
    status: 200,
    type: GetByIdReturnDto,
  })
  @Post('/')
  public async create(@Body() body: CreateDto) {
    const staff = await this.staffService.create(body);
    return { staff };
  }

  @ApiResponse({
    status: 200,
    type: GetByIdReturnDto,
  })
  @Patch('/:id')
  public async update(@Param('id') id: string, @Body() body: CreateDto) {
    const staff = await this.staffService.update(id, body);
    return { staff };
  }

  @ApiResponse({
    status: 200,
    type: GetByIdReturnDto,
  })
  @Delete('/:id')
  public async delete(@Param('id') id: string) {
    const staff = await this.staffService.delete(id);
    return { staff };
  }
}
