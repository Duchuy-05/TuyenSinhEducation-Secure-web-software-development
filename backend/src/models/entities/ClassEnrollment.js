const { EntitySchema } = require('typeorm');

class ClassEnrollment {}

const ClassEnrollmentSchema = new EntitySchema({
  name: 'ClassEnrollment',
  target: ClassEnrollment,
  tableName: 'class_enrollments',
  columns: {
  id: {
    type: Number,
    primary: true,
    generated: 'increment'
  },
  classId: {
    name: 'class_id',
    type: Number
  },
  userId: {
    name: 'user_id',
    type: Number
  },
  enrolledAt: {
    name: 'enrolled_at',
    type: Date
  },
  status: {
    type: 'enum',
    enum: [
      'active',
      'completed',
      'dropped'
    ],
    default: 'active'
  }
},
  relations: {
  class: {
    type: 'many-to-one',
    target: () => require('./Class.js').Class,
    inverseSide: 'enrollments',
    joinColumn: {
      name: 'class_id'
    }
  },
  user: {
    type: 'many-to-one',
    target: () => require('./User.js').User,
    inverseSide: 'enrollments',
    joinColumn: {
      name: 'user_id'
    }
  }
},
});

module.exports = { ClassEnrollment, ClassEnrollmentSchema };


