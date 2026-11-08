const { EntitySchema } = require('typeorm');

class Class {}

const ClassSchema = new EntitySchema({
  name: 'Class',
  target: Class,
  tableName: 'classes',
  columns: {
  id: {
    type: Number,
    primary: true,
    generated: 'increment'
  },
  courseId: {
    name: 'course_id',
    type: Number
  },
  teacherId: {
    name: 'teacher_id',
    type: Number
  },
  className: {
    name: 'class_name',
    type: String
  },
  startDate: {
    name: 'start_date',
    type: Date
  },
  endDate: {
    name: 'end_date',
    nullable: true,
    type: Date
  },
  maxStudents: {
    name: 'max_students',
    default: 30,
    type: Number
  },
  status: {
    type: 'enum',
    enum: [
      'upcoming',
      'ongoing',
      'completed'
    ],
    default: 'upcoming'
  }
},
  relations: {
  course: {
    type: 'many-to-one',
    target: () => require('./Course.js').Course,
    inverseSide: 'classes',
    joinColumn: {
      name: 'course_id'
    }
  },
  teacher: {
    type: 'many-to-one',
    target: () => require('./Teacher.js').Teacher,
    inverseSide: 'classes',
    joinColumn: {
      name: 'teacher_id'
    }
  },
  schedules: {
    type: 'one-to-many',
    target: () => require('./Schedule.js').Schedule,
    inverseSide: 'class'
  },
  enrollments: {
    type: 'one-to-many',
    target: () => require('./ClassEnrollment.js').ClassEnrollment,
    inverseSide: 'class'
  },
  announcements: {
    type: 'one-to-many',
    target: () => require('./Announcement.js').Announcement,
    inverseSide: 'class'
  }
},
});

module.exports = { Class, ClassSchema };


