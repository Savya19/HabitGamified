module.exports = (sequelize, DataTypes) => {
    const Achievement = sequelize.define(
        'Achievement',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true
            },
            name: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            description: {
                type: DataTypes.TEXT('medium'),
                allowNull: true
            },
            icon: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            xp_reward: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 10
            },
            unlock_condition: {
                type: DataTypes.TEXT('medium'),
                allowNull: false
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            }
        },
        {
            tableName: 'achievements',
            timestamps: false
        }
    );

    return Achievement;
};
