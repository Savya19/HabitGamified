module.exports = (sequelize, DataTypes) => {
    const Habit = sequelize.define(
        'Habit',
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
                    model: 'users', // actual table name
                    key: 'id',
                    onDelete: 'CASCADE',
                    onUpdate: 'CASCADE'
                }
            },
            name: {
                type: DataTypes.STRING(255),
                allowNull: false
            },
            description: {
                type: DataTypes.TEXT('medium'),
                allowNull: true
            },
            category: {
                type: DataTypes.STRING(50),
                allowNull: false,
                defaultValue: 'General'
            },
            difficulty_level: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1
            },
            target_frequency: {
                type: DataTypes.STRING(20),
                allowNull: false
            },
            is_active: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            },
            updated_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            }
        },
        {
            tableName: 'habits',
            timestamps: false
        }
    );

    return Habit;
};
