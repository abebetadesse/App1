module.exports = (sequelize, DataTypes) => {
  const Course = sequelize.define('Course', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    moodleCourseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    courseName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    durationHours: {
      type: DataTypes.INTEGER,
    },
    difficultyLevel: {
      type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
      defaultValue: 'beginner',
    },
    credits: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }, {
    timestamps: true,
    indexes: [
      { fields: ['category'] },
      { fields: ['moodleCourseId'] }
    ]
  });

  return Course;
};