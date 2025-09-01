# 🎮 Gamified Habit Tracker

A full-stack web application that transforms habit building into an engaging, game-like experience with visual progress metaphors and smart notifications.

## ✨ Features

### 🌱 Visual Progress Metaphors
- **Plant Journey**: Watch your habits grow from a tiny seed 🌱 to a mighty tree 🌳
- **Creature Journey**: Hatch and evolve your companion from an egg 🥚 to a legendary dragon 🐉
- **Milestone System**: Unlock new stages as you complete more habits
- **Progress Tracking**: Real-time visual feedback on your habit-building journey

### 🔔 Smart Notifications
- **Browser Notifications**: Get reminded to complete your daily habits
- **Customizable Reminders**: Set your preferred reminder time and timezone
- **Milestone Celebrations**: Get notified when you reach new achievements
- **Email Support**: Optional email notifications (configurable)

### 📊 Comprehensive Tracking
- **Habit Management**: Create, edit, and track multiple habits
- **Streak Tracking**: Monitor your consistency with streak counters
- **XP System**: Earn experience points for completing habits and reaching milestones
- **Achievement System**: Unlock badges and rewards for your progress

### 🎯 User Experience
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Intuitive Dashboard**: Clean, modern interface with easy navigation
- **Real-time Updates**: Instant feedback when completing habits
- **Progress Visualization**: Beautiful charts and progress bars

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Lucide React** - Beautiful icons
- **CSS3** - Custom styling with responsive design

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Sequelize** - PostgreSQL ORM
- **JWT** - Authentication and authorization
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

### Database
- **PostgreSQL** - Relational database for data persistence

## 📁 Project Structure

```
habit-tracker/
├── Backend/                 # Node.js/Express backend
│   ├── src/
│   │   ├── controllers/     # Route handlers
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Custom middleware
│   │   └── utils/           # Utility functions
│   └── package.json
├── frontend/                # React frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── contexts/        # React contexts
│   │   └── services/        # API services
│   └── package.json
├── .env                     # Environment variables
├── .gitignore
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL database
- npm or yarn package manager

### 1. Clone the Repository
```bash
git clone https://github.com/Savya19/HabitGamified.git
cd HabitGamified
```

### 2. Environment Setup
Create a `.env` file in the root directory:
```env
# Database Configuration
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_HOST=localhost
DB_PORT=5432
DB_DIALECT=postgres

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key

# Server Configuration
PORT=5000
```

### 3. Backend Setup
```bash
# Navigate to backend directory
cd Backend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The backend will run on `http://localhost:5000`

### 4. Frontend Setup
```bash
# Navigate to frontend directory (in a new terminal)
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The frontend will run on `http://localhost:3000`

## 🎮 How to Use

### Getting Started
1. **Register** a new account or **login** with existing credentials
2. **Create your first habit** by clicking "Add Habit" on the dashboard
3. **Choose your journey** - select between Plant or Creature metaphor
4. **Set up notifications** to get daily reminders

### Building Habits
1. **Complete habits daily** by clicking the "Complete" button
2. **Watch your progress** as you advance through different stages
3. **Earn XP and unlock milestones** as you maintain consistency
4. **Track your streaks** and celebrate achievements

### Progress Visualization
- Visit the **Progress** page to see your journey visualization
- Switch between **Plant** and **Creature** metaphors anytime
- View the **timeline** of all available milestones
- Monitor your **completion statistics**

### Notifications
- Go to **Notifications** settings to customize your experience
- Enable **browser notifications** for instant reminders
- Set your **preferred reminder time** and timezone
- Configure **milestone notifications** for celebrations

## 🏆 Milestone System

### Plant Journey 🌱
1. **Seed** (5 completions) - Your journey begins
2. **Sprout** (15 completions) - First signs of growth
3. **Young Plant** (30 completions) - Taking root
4. **Flowering Plant** (50 completions) - Beautiful blooms
5. **Mature Tree** (100 completions) - Strong and established

### Creature Journey 🐣
1. **Egg** (5 completions) - Something magical awaits
2. **Hatchling** (15 completions) - Your creature emerges
3. **Young Creature** (30 completions) - Growing stronger
4. **Evolved Form** (50 completions) - Dedication pays off
5. **Legendary Dragon** (100 completions) - Ultimate mastery

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Habits
- `GET /api/habits` - Get user's habits
- `POST /api/habits` - Create new habit
- `PUT /api/habits/:id` - Update habit
- `DELETE /api/habits/:id` - Delete habit
- `POST /api/habits/:id/complete` - Mark habit as completed

### Progress
- `GET /api/progress` - Get user's progress
- `POST /api/progress/update` - Update progress
- `POST /api/progress/metaphor` - Switch metaphor type
- `GET /api/progress/milestones/:type` - Get milestones

### Notifications
- `GET /api/notifications/preferences` - Get notification settings
- `PUT /api/notifications/preferences` - Update notification settings
- `POST /api/notifications/test` - Send test notification

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Icons provided by [Lucide React](https://lucide.dev/)
- Inspiration from gamification principles in habit formation
- Built with modern web development best practices

## 📞 Support

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/Savya19/HabitGamified/issues) page
2. Create a new issue with detailed information
3. Contact the maintainers

---

**Happy Habit Building! 🎯✨**

Transform your daily routines into an exciting journey of growth and achievement!