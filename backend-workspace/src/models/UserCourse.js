module.exports = (sequelize, DataTypes) => {
  const UserCourse = sequelize.define('UserCourse', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    profileOwnerId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    courseId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    moodleEnrollmentId: {
      type: DataTypes.INTEGER,
    },
    enrollmentDate: {
      type: DataTypes.DATE,
    },
    completionDate: {
      type: DataTypes.DATE,
    },
    finalGrade: {
      type: DataTypes.DECIMAL(5,2),
    },
    status: {
      type: DataTypes.ENUM('enrolled', 'in_progress', 'completed', 'failed'),
      defaultValue: 'enrolled',
    },
    certificateUrl: {
      type: DataTypes.STRING,
    },
    lastSynced: {
      type: DataTypes.DATE,
    },
  }, {
    timestamps: true,
    indexes: [
      { fields: ['profileOwnerId'] },
      { fields: ['courseId'] },
      { fields: ['status'] }
    ]
  });

  return UserCourse;
};