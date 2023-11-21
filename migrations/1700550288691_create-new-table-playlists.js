exports.up = (pgm) => {
  pgm.createTable('playlists', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    name: {
      type: 'TEXT',
      notNull: true,
    },
    username: {
      type: 'VARCHAR(50)',
    },
  });

  pgm.addConstraint('playlists', 'fk_playlist.username_users.id', 'FOREIGN KEY(username) REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropTable('playlists');
};
