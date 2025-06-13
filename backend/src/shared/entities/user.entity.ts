import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn({ generated: 'uuid' })
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  email!: string;
}
