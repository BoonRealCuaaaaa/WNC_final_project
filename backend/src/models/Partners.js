import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class Partners extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    bankName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    domain: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    partenerPublicKey: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    partenerAlgo: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    partenerSecretKey: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ourPrivateKey: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ourPublicKey: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'partners',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
