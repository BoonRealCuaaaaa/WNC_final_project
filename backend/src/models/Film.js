import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class Film extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    filmId: {
      autoIncrement: true,
      type: DataTypes.SMALLINT.UNSIGNED,
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
    },
    releaseYear: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'release_year'
    },
    languageId: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      references: {
        model: 'language',
        key: 'language_id'
      },
      field: 'language_id'
    },
    originalLanguageId: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: true,
      references: {
        model: 'language',
        key: 'language_id'
      },
      field: 'original_language_id'
    },
    rentalDuration: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      defaultValue: 3,
      field: 'rental_duration'
    },
    rentalRate: {
      type: DataTypes.DECIMAL(4,2),
      allowNull: false,
      defaultValue: 4.99,
      field: 'rental_rate'
    },
    length: {
      type: DataTypes.SMALLINT.UNSIGNED,
      allowNull: true
    },
    replacementCost: {
      type: DataTypes.DECIMAL(5,2),
      allowNull: false,
      defaultValue: 19.99,
      field: 'replacement_cost'
    },
    rating: {
      type: DataTypes.ENUM('G','PG','PG-13','R','NC-17'),
      allowNull: true,
      defaultValue: "G"
    },
    specialFeatures: {
      type: "SET('TRAILERS','COMMENTARIES','DELETED SCENES','BEHIND THE SCENES')",
      allowNull: true,
      field: 'special_features'
    },
    lastUpdate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
      field: 'last_update'
    }
  }, {
    sequelize,
    tableName: 'film',
    hasTrigger: true,
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
        name: "idx_title",
        using: "BTREE",
        fields: [
          { name: "title" },
        ]
      },
      {
        name: "idx_fk_language_id",
        using: "BTREE",
        fields: [
          { name: "language_id" },
        ]
      },
      {
        name: "idx_fk_original_language_id",
        using: "BTREE",
        fields: [
          { name: "original_language_id" },
        ]
      },
    ]
  });
  }
}
