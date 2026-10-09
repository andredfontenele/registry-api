exports.up = (pgm) => {
  pgm.createType('phone_type', ['mobile', 'home', 'work']);

  pgm.createTable('phone_numbers', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    person_id: {
      type: 'uuid',
      notNull: true,
      references: '"persons"',
      onDelete: 'CASCADE',
    },
    number: { type: 'text', notNull: true },
    type: { type: 'phone_type', notNull: true, default: 'mobile' },
    created_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') },
  });

  pgm.createIndex('phone_numbers', 'person_id');
};

exports.down = (pgm) => {
  pgm.dropTable('phone_numbers');
  pgm.dropType('phone_type');
};
