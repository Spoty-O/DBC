import { Document } from 'mongoose';

export interface IStaff extends Document {
  readonly name: string;
}
