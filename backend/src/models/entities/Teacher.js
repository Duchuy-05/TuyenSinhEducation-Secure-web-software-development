const { EntitySchema } = require('typeorm');

class Teacher {}

const TeacherSchema = new EntitySchema({
  name: 'Teacher',
  target: Teacher,
  tableName: 'teachers',
  columns: {
  id: {
    type: Number,
    primary: true,
    generated: 'increment'
  },
  fullName: {
    name: 'full_name',
    type: String
  },
  email: {
    nullable: true,
    unique: true,
    type: String
  },
  phone: {
    nullable: true,
    type: String
  },
  title: {
    nullable: true,
    type: String
  },
  experience: {
    nullable: true,
    type: String
  },
  company: {
    nullable: true,
    type: String
  },
  specialization: {
    nullable: true,
    type: String
  },
  bio: {
    type: 'text',
    nullable: true
  },
  avatarUrl: {
    name: 'avatar_url',
    nullable: true,
    type: String
  },
  createdAt: {
    name: 'created_at',
    createDate: true,
    type: 'datetime'
  },
  updatedAt: {
    name: 'updated_at',
    updateDate: true,
    type: 'datetime'
  }
},
  relations: {
  user: {
    type: 'one-to-one',
    target: () => require('./User.js').User,
    onDelete: 'CASCADE',
    joinColumn: {
      name: 'user_id'
    }
  },
  courses: {
    type: 'one-to-many',
    target: () => require('./Course.js').Course,
    inverseSide: 'teacher'
  },
  classes: {
    type: 'one-to-many',
    target: () => require('./Class.js').Class,
    inverseSide: 'teacher'
  },
  announcements: {
    type: 'one-to-many',
    target: () => require('./Announcement.js').Announcement,
    inverseSide: 'teacher'
  }
},
});

module.exports = { Teacher, TeacherSchema };


