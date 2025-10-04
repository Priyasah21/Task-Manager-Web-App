# Task-Manager-Web-App
# 🚀 TaskFlow Pro - Full Stack Task Management Application

A modern, feature-rich task management application built with the MERN stack (MongoDB, Express.js, React, Node.js). This application demonstrates full-stack development skills including authentication, CRUD operations, real-time updates, and gamification features.

![TaskFlow Pro](https://img.shields.io/badge/Version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

## ✨ Features

### 🔐 Authentication & Security
- User registration and login
- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes

### 📝 Task Management
- Create, Read, Update, Delete (CRUD) operations
- Task prioritization (Low, Medium, High)
- Task categorization (Personal, Work, Shopping, Health)
- Task completion tracking
- Edit tasks inline

### 🎮 Gamification
- Points system based on task priority
- Streak counter for completed tasks
- Real-time statistics dashboard
- Animated feedback on task completion

### 🎨 Modern UI/UX
- Responsive design for all devices
- Beautiful gradient themes
- Smooth animations and transitions
- Interactive hover effects
- Filter tasks by status and category

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing

### Frontend
- **React** - UI library
- **React Hooks** - State management
- **Lucide React** - Icon library
- **Tailwind CSS** - Utility-first CSS framework

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas cloud)
- npm or yarn

### Backend Setup

1. **Create backend folder and navigate:**
```bash
mkdir taskflow-backend
cd taskflow-backend
```

2. **Initialize npm:**
```bash
npm init -y
```

3. **Install dependencies:**
```bash
npm install express mongoose cors bcryptjs jsonwebtoken dotenv
npm install --save-dev nodemon
```

4. **Create `server.js` file** and copy the backend code

5. **Create `.env` file:**
```env
MONGODB_URI=mongodb://localhost:27017/taskflow
JWT_SECRET=your-super-secret-jwt-key-change-this
PORT=5000
NODE_ENV=development
```

6. **Start MongoDB:**
```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas (cloud) - recommended for production
```

7. **Run the backend server:**
```bash
npm run dev
```

Server will run on `http://localhost:5000`

### Frontend Setup

1. **Create React app:**
```bash
npx create-react-app taskflow-frontend
cd taskflow-frontend
```

2. **Install dependencies:**
```bash
npm install lucide-react
```

3. **Create `src/api.js`** and copy the API service code

4. **Replace `src/App.jsx`** with the frontend App component code

5. **Start the React app:**
```bash
npm start
```

App will run on `http://localhost:3000`

## 📁 Project Structure

```
taskflow-fullstack/
│
├── backend/
│   ├── server.js           # Main backend server file
│   ├── package.json        # Backend dependencies
│   ├── .env               # Environment variables
│   └── node_modules/
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── App.jsx        # Main React component
    │   ├── api.js         # API service layer
    │   ├── index.js       # React entry point
    │   └── index.css      # Global styles
    ├── package.json       # Frontend dependencies
    └── node_modules/
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Tasks (Protected Routes)
- `GET /api/tasks` - Get all tasks for logged-in user
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### User
- `GET /api/user/profile` - Get user profile and statistics

## 🎯 Usage

1. **Register/Login:**
   - Open the application
   - Register a new account or login
   - JWT token will be stored in localStorage

2. **Create Tasks:**
   - Enter task description
   - Select priority level (affects points)
   - Select category
   - Click "Add Task"

3. **Manage Tasks:**
   - Click checkbox to mark complete (earn points!)
   - Click edit icon to modify task
   - Click delete icon to remove task
   - Use filters to view specific tasks

4. **Track Progress:**
   - View total points earned
   - Monitor your streak
   - See completion statistics
   - Track high-priority tasks

## 🌐 MongoDB Setup Options

### Option A: Local MongoDB
```bash
# Install MongoDB locally
# Start MongoDB service
mongod
```

### Option B: MongoDB Atlas (Cloud - Recommended)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a FREE account
3. Create a new cluster
4. Get your connection string
5. Update `.env` file:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/taskflow
```

## 🔒 Security Features

- Passwords are hashed using bcrypt before storage
- JWT tokens expire after 7 days
- Protected routes require valid authentication
- CORS enabled for frontend-backend communication
- Environment variables for sensitive data

## 🎨 Features Showcase

### Points System
- **Low Priority:** +5 points
- **Medium Priority:** +10 points
- **High Priority:** +15 points

### Categories
- **Personal:** Purple theme
- **Work:** Blue theme
- **Shopping:** Green theme
- **Health:** Red theme

## 📱 Responsive Design

The application is fully responsive and works on:
- 📱 Mobile phones
- 📱 Tablets
- 💻 Laptops
- 🖥️ Desktop computers

## 🚀 Deployment

### Backend Deployment (Heroku/Railway/Render)
1. Push code to GitHub
2. Connect to deployment platform
3. Set environment variables
4. Deploy

### Frontend Deployment (Vercel/Netlify)
1. Build the React app: `npm run build`
2. Deploy the build folder
3. Update API_URL in api.js to your backend URL

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Your Name**
- Portfolio: [your-portfolio.com]
- LinkedIn: [your-linkedin]
- GitHub: [your-github]

## 🙏 Acknowledgments

- React Team for the amazing library
- MongoDB for the powerful database
- Lucide for beautiful icons
- Tailwind CSS for utility classes

---

**Made with ❤️ by [Your Name]**

For any questions or issues, please open an issue on GitHub.
