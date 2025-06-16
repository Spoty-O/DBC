import { BeforeInsert, Column, Entity, PrimaryColumn } from 'typeorm';
import { IUser } from '../interfaces';
import { hashSync } from 'bcryptjs';
@Entity()
export class User implements IUser {
  @PrimaryColumn({ generated: 'uuid' })
  id!: string;

  @Column({ type: 'varchar', length: 100 })
  email!: string;

  @Column({ type: 'varchar', length: 60 })
  password!: string;

  @BeforeInsert()
  hashPassword() {
    this.password = hashSync(this.password, 10);
  }
}
