import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Organization } from './organization.entity';

@Entity('tutors')
export class Tutor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 200, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 200, unique: true, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 250, nullable: false, select: false })
  password: string;

  @Column({ name: 'organization_id' })
  organization_id: number;

  // The relationship defined by the foreign key in your migration
  @ManyToOne(() => Organization, (org) => org.tutors, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;
}
