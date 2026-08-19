import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Class } from './Class';

@Entity('schedules')
export class Schedule {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'class_id' })
  classId: number;           // thuộc lớp nào, không còn courseId

  @Column({ name: 'session_title' })
  sessionTitle: string;

  @Column({ name: 'session_number', type: 'int' })
  sessionNumber: number;

  @Column({ name: 'start_time' })
  startTime: Date;

  @Column({ name: 'end_time' })
  endTime: Date;

  @Column({ nullable: true })
  location: string;

  @Column({ type: 'enum', enum: ['upcoming', 'ongoing', 'completed'], default: 'upcoming' })
  status: string;

  @ManyToOne(() => Class, (cls) => cls.schedules)
  @JoinColumn({ name: 'class_id' })
  class: Class;

}