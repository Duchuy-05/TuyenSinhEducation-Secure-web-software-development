import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Course } from './Course';

@Entity('course_syllabus')
export class CourseSyllabus {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'course_id' })
  courseId: number;

  @Column({ name: 'order_index', type: 'int', default: 0 })
  orderIndex: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => Course, (course) => course.syllabus, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'course_id' })
  course: Course;
}