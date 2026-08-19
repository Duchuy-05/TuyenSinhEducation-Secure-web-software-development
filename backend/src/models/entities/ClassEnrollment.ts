import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Class } from './Class';
import { User } from './User';


@Entity('class_enrollments')
export class ClassEnrollment {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'class_id' })
  classId: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'enrolled_at' })
  enrolledAt: Date;

  @Column({ type: 'enum', enum: ['active', 'completed', 'dropped'], default: 'active' })
  status: string;

  @ManyToOne(() => Class, (cls) => cls.enrollments)
  @JoinColumn({ name: 'class_id' })
  class: Class;

  @ManyToOne(() => User, (user) => user.enrollments)
  @JoinColumn({ name: 'user_id' })
  user: User;
}