# FeedbackHub - Clueso.io Clone

A comprehensive feedback management platform with AI-powered insights, built with React, Node.js, Express, and MongoDB.

## 🎯 Features

- **User Authentication** - Secure sign-up/sign-in with JWT tokens
- **Dashboard Analytics** - Real-time feedback statistics and metrics
- **Feedback Management** - Create, read, update, and delete feedback items
- **AI-Powered Insights** - Automated sentiment analysis and categorization
- **User Management** - Multi-user support with role-based access
- **Responsive Design** - Works seamlessly on desktop and mobile
- **Data Persistence** - MongoDB for reliable data storage
- **RESTful API** - Well-structured backend API

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v16 or higher)
- npm or yarn
- MongoDB (v4.4 or higher)
- Git

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/feedbackhub.git
cd feedbackhub
```

### 2. Install Dependencies

#### Backend Setup
```bash
cd backend
npm install
```

#### Frontend Setup
```bash
cd ../frontend
npm install
```

### 3. Environment Configuration

#### Backend (.env)
Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/feedbackhub
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
NODE_ENV=development
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

#### Frontend (.env)
Create a `.env` file in the `frontend` directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. Start MongoDB

Make sure MongoDB is running:

```bash
# macOS (with Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

### 5. Run the Application

#### Terminal 1 - Backend Server
```bash
cd backend
npm run dev
```

The backend will start on http://localhost:5000

#### Terminal 2 - Frontend Server
```bash
cd frontend
npm start
```

The frontend will start on http://localhost:3000

## 📁 Project Structure

```
feedbackhub/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── feedbackController.js
│   │   │   └── aiController.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── errorHandler.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   └── Feedback.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── feedback.js
│   │   │   └── ai.js
│   │   ├── services/
│   │   │   └── aiService.js
│   │   └── server.js
│   ├── .env
│   ├── package.json
│   └── README.md
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   │   ├── Login.js
│   │   │   │   └── Signup.js
│   │   │   ├── Dashboard/
│   │   │   │   ├── Dashboard.js
│   │   │   │   ├── Stats.js
│   │   │   │   └── Sidebar.js
│   │   │   ├── Feedback/
│   │   │   │   ├── FeedbackList.js
│   │   │   │   ├── FeedbackItem.js
│   │   │   │   └── FeedbackForm.js
│   │   │   └── Insights/
│   │   │       └── AIInsights.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── utils/
│   │   │   └── helpers.js
│   │   ├── App.js
│   │   └── index.js
│   ├── .env
│   ├── package.json
│   └── tailwind.config.js
│
└── README.md
```

## 🔧 Configuration

### MongoDB Configuration

If using MongoDB Atlas (cloud):

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/feedbackhub?retryWrites=true&w=majority
```

### JWT Configuration

Generate a secure JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### AI Service Configuration

To enable AI-powered insights, you'll need an Anthropic API key:

1. Sign up at https://console.anthropic.com
2. Create an API key
3. Add it to your `.env` file

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📚 API Documentation

### Authentication Endpoints

#### POST /api/auth/signup
Register a new user
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "company": "Acme Inc"
}
```

#### POST /api/auth/login
Login existing user
```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

### Feedback Endpoints

#### GET /api/feedback
Get all feedback (requires authentication)

#### POST /api/feedback
Create new feedback
```json
{
  "title": "Feature Request",
  "description": "Add dark mode",
  "status": "open"
}
```

#### PATCH /api/feedback/:id
Update feedback item

#### DELETE /api/feedback/:id
Delete feedback item

### AI Endpoints

#### POST /api/ai/analyze
Analyze feedback with AI
```json
{
  "feedbackIds": ["id1", "id2", "id3"]
}
```

## 🎨 Customization

### Changing Theme Colors

Edit `frontend/tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#your-color',
        secondary: '#your-color',
      }
    }
  }
}
```

### Adding New Features

1. Create controller in `backend/src/controllers/`
2. Create routes in `backend/src/routes/`
3. Create React components in `frontend/src/components/`
4. Update API service in `frontend/src/services/api.js`

## 🐛 Troubleshooting

### MongoDB Connection Issues

```bash
# Check MongoDB status
brew services list  # macOS
sudo systemctl status mongod  # Linux

# Restart MongoDB
brew services restart mongodb-community  # macOS
sudo systemctl restart mongod  # Linux
```

### Port Already in Use

```bash
# Find process using port
lsof -i :5000  # Backend
lsof -i :3000  # Frontend

# Kill process
kill -9 <PID>
```

### CORS Issues

Ensure your backend has proper CORS configuration in `server.js`:

```javascript
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

## 📦 Deployment

### Backend (Heroku)

```bash
cd backend
heroku create feedbackhub-api
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_jwt_secret
git push heroku main
```

### Frontend (Vercel)

```bash
cd frontend
npm install -g vercel
vercel
```

### Environment Variables for Production

Remember to set all environment variables in your hosting platform:
- MongoDB URI
- JWT Secret
- API URLs
- Anthropic API Key

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## 🙏 Acknowledgments

- Inspired by Clueso.io
- Built with React, Node.js, Express, and MongoDB
- UI components styled with Tailwind CSS
- Icons from Lucide React
- AI powered by Anthropic Claude





Built with ❤️ 