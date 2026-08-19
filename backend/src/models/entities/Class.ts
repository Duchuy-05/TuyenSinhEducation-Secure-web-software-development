import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Course } from './Course';
import { Teacher } from './Teacher';
import { Schedule } from './Schedule';
import { ClassEnrollment } from './ClassEnrollment';
import { Announcement } from './Announcement';

@Entity('classes')
export class Class {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'course_id' })
  courseId: number;

  @Column({ name: 'teacher_id' })
  teacherId: number;

  @Column({ name: 'class_name' })
  className: string;

  @Column({ name: 'start_date' })
  startDate: Date;

  @Column({ name: 'end_date', nullable: true })
  endDate: Date;

  @Column({ name: 'max_students', default: 30 })
  maxStudents: number;

  @Column({ type: 'enum', enum: ['upcoming', 'ongoing', 'completed'], default: 'upcoming' })
  status: string;

  @ManyToOne(() => Course, (course) => course.classes)
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @ManyToOne(() => Teacher, (teacher) => teacher.classes)
  @JoinColumn({ name: 'teacher_id' })
  teacher: Teacher;

  @OneToMany(() => Schedule, (schedule) => schedule.class)
  schedules: Schedule[];

  @OneToMany(() => ClassEnrollment, (enrollment) => enrollment.class)
  enrollments: ClassEnrollment[];

  @OneToMany(() => Announcement, (announcement) => announcement.class)
  announcements: Announcement[];
}