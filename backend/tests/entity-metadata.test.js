const test = require('node:test');
const assert = require('node:assert/strict');
const names = ['User','Teacher','Course','CourseSyllabus','Registration','Post','Class','Schedule','ClassEnrollment','Announcement','Payment'];
test('entity schemas expose their runtime class and preserve representative mapping', () => {
  const entities = Object.fromEntries(names.map(file => [file, require(`../src/models/entities/${file}.js`)]));
  for (const file of names) {
    const name = file === 'Payment' ? 'Order' : file;
    assert.equal(entities[file][`${name}Schema`].options.target, entities[file][name]);
  }
  assert.ok(new entities.User.User());
  assert.ok(new entities.Payment.Order());
  assert.equal(entities.User.UserRole.STUDENT, 'student');
  assert.equal(entities.Payment.OrderStatus.PAID, 'paid');
  assert.equal(entities.User.UserSchema.options.tableName, 'users');
  assert.equal(entities.User.UserSchema.options.columns.fullName.name, 'full_name');
  assert.equal(entities.Payment.OrderSchema.options.columns.orderCode.name, 'order_code');
  assert.equal(entities.Payment.OrderSchema.options.relations.user.joinColumn.name, 'user_id');
  assert.equal(entities.Payment.OrderSchema.options.relations.user.onDelete, 'CASCADE');
});

test('schemas build the original table, column and relation counts without a database connection', async () => {
  const { DataSource } = require('typeorm');
  const schemas = names.map(file => {
    const name = file === 'Payment' ? 'Order' : file;
    return require(`../src/models/entities/${file}.js`)[`${name}Schema`];
  });
  const source = new DataSource({ type: 'mysql', database: 'metadata_only', entities: schemas });
  await source.buildMetadatas();
  const counts = Object.fromEntries(source.entityMetadatas.map(entity => [entity.tableName, [entity.columns.length, entity.relations.length]]));
  assert.deepEqual(counts, {
    users: [13, 2], teachers: [13, 4], courses: [22, 5], course_syllabus: [5, 1],
    registrations: [11, 2], posts: [10, 0], classes: [8, 5], schedules: [8, 1],
    class_enrollments: [5, 2], announcements: [9, 2], orders: [14, 2],
  });
  const orders = source.getMetadata('Order');
  assert.equal(orders.findColumnWithPropertyName('orderCode').databaseName, 'order_code');
  assert.ok(orders.indices.some(index => index.isUnique && index.columns.some(column => column.databaseName === 'order_code')));
  assert.ok(orders.foreignKeys.some(key => key.columnNames.includes('user_id') && key.onDelete === 'CASCADE'));
});


test('enum schema definitions reference the exported runtime enums', () => {
  for (const [file, schema, column, runtime] of [
    ['User', 'UserSchema', 'role', 'UserRole'], ['Course', 'CourseSchema', 'format', 'CourseFormat'],
    ['Course', 'CourseSchema', 'status', 'CourseStatus'], ['Registration', 'RegistrationSchema', 'status', 'RegistrationStatus'],
    ['Post', 'PostSchema', 'status', 'PostStatus'], ['Payment', 'OrderSchema', 'status', 'OrderStatus'],
    ['Payment', 'OrderSchema', 'paymentMethod', 'PaymentMethod'], ['Announcement', 'AnnouncementSchema', 'type', 'AnnouncementType'],
  ]) {
    const entity = require(`../src/models/entities/${file}.js`);
    assert.equal(entity[schema].options.columns[column].enum, entity[runtime], `${schema}.${column}`);
  }
});
