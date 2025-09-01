require('dotenv').config();

const { sequelize } = require('./src/models/index');

(async () => {
    try{
        console.log('Syncing Database...');
        await sequelize.sync({alter: true});
        console.log('Database synced successfully.');
    }catch(error){
        console.error('Error syncing database:', error);
    }finally{
        await sequelize.close();
        console.log('Database connection closed.');
    }
})();