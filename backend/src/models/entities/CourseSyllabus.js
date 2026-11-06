const { EntitySchema } = require('typeorm');

class CourseSyllabus {}

const CourseSyllabusSchema = new EntitySchema({
  name: 'CourseSyllabus',
  target: CourseSyllabus,
  tableName: 'course_syllabus',
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
  orderIndex: {
    name: 'order_index',
    type: 'int',
    default: 0
  },
  title: {
    type: String
  },
  description: {
    type: 'text',
    nullable: true
  }
},
  relations: {
  course: {
    type: 'many-to-one',
    target: () => require('./Course.js').Course,
    inverseSide: 'syllabus',
    onDelete: 'CASCADE',
    joinColumn: {
      name: 'course_id'
    }
  }
},
});

module.exports = { CourseSyllabus, CourseSyllabusSchema };


