import { ApiProperty } from '@nestjs/swagger';
import { StaffResponseModel } from '../../../../shared/models/staff.model';

export class GetAllReturnDto {
  @ApiProperty({
    example: [
      {
        id: '1',
        name: 'name',
      },
    ],
    description: 'Returns list of all staff',
  })
  public staff!: StaffResponseModel[];
}
