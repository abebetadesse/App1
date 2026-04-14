import { sequelize, DataTypes } from '../config/database.js';
import User from './User.js';

const ProfileOwner = sequelize.define('ProfileOwner', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  hourlyRate: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  serviceCategory: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  skills: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  experienceYears: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  availability: {
    type: DataTypes.ENUM('immediate', '1_week', '2_weeks', '1_month'),
    defaultValue: 'immediate',
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isPhoneVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  professionalRank: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  rankingScore: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0.0,
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isAvailable: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  timestamps: true,
  tableName: 'profile_owners'
});

// Define association
ProfileOwner.belongsTo(User, { foreignKey: 'userId' });
User.hasOne(ProfileOwner, { foreignKey: 'userId' });

export default ProfileOwner;