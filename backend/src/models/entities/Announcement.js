const { EntitySchema } = require('typeorm');

const AnnouncementType = {
  GENERAL: 'general',
  URGENT: 'urgent',
  HOMEWORK: 'homework'
};

class Announcement {}

const AnnouncementSchema = new EntitySchema({
  name: 'Announcement',
  target: Announcement,
  tableName: 'announcements',
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
  teacherId: {
    name: 'teacher_id',
    type: Number
  },
  title: {
    type: String
  },
  content: {
    type: 'text'
  },
  type: {
    type: 'enum',
    enum: AnnouncementType,
    default: AnnouncementType.GENERAL
  },
  isPinned: {
    name: 'is_pinned',
    default: false,
    type: Boolean
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
  class: {
    type: 'many-to-one',
    target: () => require('./Class.js').Class,
    inverseSide: 'announcements',
    onDelete: 'CASCADE',
    joinColumn: {
      name: 'class_id'
    }
  },
  teacher: {
    type: 'many-to-one',
    target: () => require('./Teacher.js').Teacher,
    inverseSide: 'announcements',
    joinColumn: {
      name: 'teacher_id'
    }
  }
},
});

module.exports = { Announcement, AnnouncementSchema, AnnouncementType };


