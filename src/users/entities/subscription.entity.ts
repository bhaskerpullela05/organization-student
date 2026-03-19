import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { couldStartTrivia } from 'typescript';

@Entity()
export class Subscription {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  plan_name: string;

  @Column()
  max_users: number;

  @Column()
  expires_at: Date;

  @Column()
  status: string;
}
