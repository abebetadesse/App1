module.exports = (sequelize, DataTypes) => {
  const RankingCriteria = sequelize.define('RankingCriteria', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    weight: {
      type: DataTypes.DECIMAL(3,2),
      allowNull: false,
      validate: { min: 0, max: 1 },
    },
    formula: {
      type: DataTypes.TEXT,
    },
    parameters: {
      type: DataTypes.JSON,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    createdBy: {
      type: DataTypes.UUID,
    },
  }, {
    timestamps: true,
  });

  return RankingCriteria;
};