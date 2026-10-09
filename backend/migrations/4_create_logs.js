exports.up = (pgm) => {
  pgm.createTable('logs', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    method: { type: 'text', notNull: true },
    url: { type: 'text', notNull: true },
    status_code: { type: 'integer' },
    user_agent: { type: 'text' },
    body: { type: 'jsonb', default: "'{}'" },
    params: { type: 'jsonb', default: "'{}'" },
    created_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') },
  });

  pgm.createIndex('logs', 'created_at');
};

exports.down = (pgm) => {
  pgm.dropTable('logs');
};
