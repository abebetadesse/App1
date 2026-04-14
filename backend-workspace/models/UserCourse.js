module.exports = (sequelize, DataTypes) => {
  const UserCourse = sequelize.define('UserCourse', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: false },
    courseId: { type: DataTypes.INTEGER, allowNull: false },
    progress: { type: DataTypes.INTEGER, defaultValue: 0 },
    grade: { type: DataTypes.FLOAT },
    completedAt: { type: DataTypes.DATE },
    lastSync: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  });
  return UserCourse;
};
