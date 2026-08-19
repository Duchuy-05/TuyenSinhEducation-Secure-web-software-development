import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne  ,
  JoinColumn
} from 'typeorm';
import { Course } from './Course';
import { Class } from './Class';
import { Announcement } from './Announcement';
import { User } from './User';

@Entity('teachers')
export class Teacher {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'full_name' })
  fullName: string;

  @Column({ nullable: true, unique: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true})
  title: string;

  @Column({ nullable: true })
  experience: string;

  @Column({ nullable: true })
  company: string;

  @Column({ nullable: true })
  specialization: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ name: 'avatar_url', nullable: true })
  avatarUrl: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Course, (course) => course.teacher)
  courses: Course[];

  @OneToMany(() => Class, (cls) => cls.teacher)
  classes: Class[];

  @OneToMany(() => Announcement, (announcement) => announcement.teacher)
  announcements: Announcement[];
}