import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';
import { typedI18nValidationMessage } from 'src/shared/utils/get-typed-I18n-validation-message.util';

export class CreateDto {
  @ApiProperty({
    example: 'name',
    description: "Staff's name",
  })
  @IsString({
    message: typedI18nValidationMessage('validation.invalidName'),
  })
  @MaxLength(50, {
    message: typedI18nValidationMessage('validation.nameTooLong'),
  })
  public name!: string;
}
