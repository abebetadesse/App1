module.exports = (sequelize, DataTypes) => {
  const SearchQuery = sequelize.define('SearchQuery', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    clientId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    searchCriteria: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    resultsCount: {
      type: DataTypes.INTEGER,
    },
    topMatches: {
      type: DataTypes.JSON,
    },
    searchDuration: {
      type: DataTypes.INTEGER,
    },
  }, {
    timestamps: true,
  });

  return SearchQuery;
};