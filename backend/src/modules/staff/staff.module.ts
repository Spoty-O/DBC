import { Module, OnModuleInit } from '@nestjs/common';
import { StaffService } from './staff.service';
import { StaffController } from './staff.controller';
import { ErrorModule } from '../error/error.module';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { StaffSchema } from 'src/shared/schemas';
import { AxiosModule } from '../axios/axios.module';

@Module({
  providers: [StaffService],
  controllers: [StaffController],
  imports: [
    ErrorModule,
    MongooseModule.forFeature([{ name: 'Staff', schema: StaffSchema }]),
    AxiosModule,
  ],
})
export class StaffModule implements OnModuleInit {
  constructor(
    private readonly configService: ConfigService,
    private readonly staffService: StaffService,
  ) {}
  public async onModuleInit() {
    if (process.env.NODE_ENV === 'development') {
      await Promise.all([console.log('StaffModule initialized')]);
    }
  }
}
