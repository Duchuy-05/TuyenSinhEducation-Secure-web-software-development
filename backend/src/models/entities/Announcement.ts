import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Class } from './Class';
import { Teacher } from './Teacher';

export enum AnnouncementType {
  GENERAL = 'general',
  URGENT = 'urgent',
  HOMEWORK = 'homework',
}

@Entity('announcements')
export class Announcement {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'class_id' })
  classId: number;

  @Column({ name: 'teacher_id' })
  teacherId: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({
    type: 'enum',
    enum: AnnouncementType,
    default: AnnouncementType.GENERAL,
  })
  type: AnnouncementType;

  @Column({ name: 'is_pinned', default: false })
  isPinned: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Class, (cls) => cls.announcements, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'class_id' })
  class: Class;

  @ManyToOne(() => Teacher, (teacher) => teacher.announcements)
  @JoinColumn({ name: 'teacher_id' })
  teacher: Teacher;
}