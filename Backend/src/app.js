require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/habits', require('./routes/habits'));
app.use('/api/users', require('./routes/users'));
app.use('/api/password-reset', require('./routes/passwordReset'));
app.use('/api/progress', require('./routes/progress'));
app.use('/api/notifications', require('./routes/notifications'));

app.get('/', (req, res) => {
    res.send('Welcome to the Habit Tracker API');
});

const { sequelize } = require('./models');
const PORT = process.env.PORT || 5000;

sequelize.sync().then(async () => {
    // Seed milestones
    const { seedMilestones } = require('./utils/seedMilestones');
    await seedMilestones();
    
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((error) => {
    console.error('Unable to connect to the database: ', error);
});
