exports.up = (pgm) => {
  pgm.createTable('addresses', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    person_id: {
      type: 'uuid',
      notNull: true,
      references: '"persons"',
      onDelete: 'CASCADE',
    },
    street: { type: 'text', notNull: true },
    number: { type: 'text', notNull: true },
    complement: { type: 'text' },
    neighborhood: { type: 'text', notNull: true },
    city: { type: 'text', notNull: true },
    state: { type: 'char(2)', notNull: true },
    postal_code: { type: 'char(8)', notNull: true },
    created_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') },
  });

  pgm.createIndex('addresses', 'person_id');
};

exports.down = (pgm) => {
  pgm.dropTable('addresses');
};
