import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Staff {
  @Prop()
  name!: string;
}
export const StaffSchema = SchemaFactory.createForClass(Staff);
