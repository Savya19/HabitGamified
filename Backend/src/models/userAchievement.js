module.exports = (sequelize, DataTypes) => {
    const UserAchievement = sequelize.define(
        'UserAchievement',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id'
                }
            },
            achievement_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'achievements',
                    key: 'id'
                }
            },
            unlocked_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW
            }
        },
        {
            tableName: 'user_achievements',
            timestamps: false
        }
    );

    return UserAchievement;
};
