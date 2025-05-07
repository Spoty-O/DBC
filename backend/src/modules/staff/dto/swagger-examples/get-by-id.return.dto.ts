import { ApiProperty } from '@nestjs/swagger';
import { StaffResponseModel } from '../../../../shared/models/staff.model';

export class GetByIdReturnDto {
  @ApiProperty({
    example: {
      id: '1',
      name: 'name',
    },
    description: 'Returns staff by id',
  })
  public staff!: StaffResponseModel;
}
