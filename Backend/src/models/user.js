module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        'User',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            email: {
                type: DataTypes.STRING(255),
                allowNull: false,
                unique: true
            },
            username: {
                type: DataTypes.STRING(50),
                allowNull: false,
                unique: true
            },
            password_hash: {
                type: DataTypes.STRING(255),
                allowNull: false
            },
            created_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW
            },
            avatar_level: {
                type: DataTypes.INTEGER,
                defaultValue: 1
            },
            total_xp: {
                type: DataTypes.INTEGER,
                defaultValue: 0
            },
            reset_token: {
                type: DataTypes.STRING(255),
                allowNull: true
            },
            reset_token_expiry: {
                type: DataTypes.DATE,
                allowNull: true
            }
        },
        {
            tableName: 'users',
            timestamps: false
        }
    );

    return User;
};
