import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Tutor } from './tutor.entity';

@Entity('organization')
export class Organization {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 150, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 200, unique: true, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 250, nullable: false, select: false })
  password: string;

  @Column({ name: 'max_limit', type: 'int', nullable: false })
  max_limit: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column()
  subscription_id: number;

  // Inverse relationship: One Organization has Many Tutors
  @OneToMany(() => Tutor, (tutor) => tutor.organization)
  tutors: Tutor[];
}
