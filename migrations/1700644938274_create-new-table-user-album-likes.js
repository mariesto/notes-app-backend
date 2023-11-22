exports.up = (pgm) => {
  pgm.createTable('user_album_likes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    userId: {
      type: 'VARCHAR(50)',
      references: '"users"',
      onDelete: 'cascade',
    },
    albumId: {
      type: 'VARCHAR(50)',
      references: '"albums"',
      onDelete: 'cascade',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('user_album_likes');
};
