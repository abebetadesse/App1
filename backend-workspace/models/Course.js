module.exports = (sequelize, DataTypes) => {
  const Course = sequelize.define('Course', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    moodleCourseId: { type: DataTypes.INTEGER, unique: true, allowNull: false },
    fullname: { type: DataTypes.STRING, allowNull: false },
    shortname: { type: DataTypes.STRING },
    categoryId: { type: DataTypes.INTEGER },
    rankingWeight: { type: DataTypes.FLOAT, defaultValue: 1.0 }
  });
  return Course;
};
