exports.up = (pgm) => {
  pgm.createTable('persons', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    first_name: { type: 'text', notNull: true },
    last_name: { type: 'text', notNull: true },
    email: { type: 'text', notNull: true, unique: true },
    document_number: { type: 'text', notNull: true, unique: true },
    date_of_birth: { type: 'date', notNull: true },
    created_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') },
    updated_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('persons');
};
