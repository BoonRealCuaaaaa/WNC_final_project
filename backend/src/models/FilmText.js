import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class FilmText extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    filmId: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      primaryKey: true,
      field: 'film_id'
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'film_text',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "film_id" },
        ]
      },
      {
        name: "idx_title_description",
        type: "FULLTEXT",
        fields: [
          { name: "title" },
          { name: "description" },
        ]
      },
    ]
  });
  }
}
