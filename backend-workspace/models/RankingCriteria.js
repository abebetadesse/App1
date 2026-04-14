module.exports = (sequelize, DataTypes) => {
  const RankingCriteria = sequelize.define('RankingCriteria', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    category: { type: DataTypes.ENUM('education', 'experience', 'skills', 'ratings'), allowNull: false },
    weight: { type: DataTypes.FLOAT, defaultValue: 0.0 },
    formula: { type: DataTypes.TEXT },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
  });
  return RankingCriteria;
};
