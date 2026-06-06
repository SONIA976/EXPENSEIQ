# 💰 ExpenseIQ

A full-stack web application for managing personal income and expenses with detailed analytics and insights.

## 🚀 Features

### 💳 Income Management
- Add income entries with custom descriptions
- 10 predefined income sources with icons
- Visual icon selection
- Delete functionality with confirmation
- Income overview charts

### 💸 Expense Management
- Add expense entries with descriptions
- 10 expense categories with icons
- Visual icon picker
- Delete functionality with confirmation
- Expense analytics and charts

### 📊 Analytics & Insights
- Monthly bar charts for income and expenses
- Category-wise pie charts
- Total and average calculations
- Interactive tooltips with sample data
- Responsive chart design

### 🔐 Authentication
- User registration and login
- JWT token-based authentication
- Secure password handling
- Profile photo upload
- Logout confirmation

### 🎨 User Interface
- Modern, responsive design
- Custom branding with logo
- Dark/light theme support
- Mobile-friendly interface
- Smooth animations and transitions

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Recharts** - Data visualization
- **Axios** - HTTP client
- **React Icons** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Multer** - File uploads
- **CORS** - Cross-origin requests

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Git

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd expense-tracker
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend/Expense\ Tracker
   npm install
   ```

3. **Environment Setup**
   ```bash
   # In the backend directory, create a .env file
   cd ../../backend
   ```
   
   Create `.env` file with:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=8000
   NODE_ENV=development
   CLIENT_URL=http://localhost:5174
   ```

4. **Start the servers**
   ```bash
   # Start backend server (from backend directory)
   npm run dev
   
   # Start frontend server (from frontend/Expense Tracker directory)
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5174
   - Backend API: http://localhost:8000

## 📁 Project Structure

```
expense-tracker/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── server.js
│   └── package.json
├── frontend/
│   └── Expense Tracker/
│       ├── public/
│       ├── src/
│       │   ├── components/
│       │   ├── context/
│       │   ├── hooks/
│       │   ├── pages/
│       │   ├── Utils/
│       │   └── main.jsx
│       └── package.json
├── .gitignore
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/getUser` - Get user info
- `POST /api/v1/auth/upload-image` - Upload profile photo

### Income
- `POST /api/v1/income/add` - Add income
- `GET /api/v1/income/get` - Get all income
- `DELETE /api/v1/income/:id` - Delete income
- `GET /api/v1/income/downloadexcel` - Download income Excel

### Expenses
- `POST /api/v1/expense/add` - Add expense
- `GET /api/v1/expense/get` - Get all expenses
- `DELETE /api/v1/expense/:id` - Delete expense
- `GET /api/v1/expense/downloadexcel` - Download expense Excel

### Dashboard
- `GET /api/v1/dashboard` - Get dashboard data

## 🎯 Key Features

### Income Management
- **Multiple Sources**: Salary, Freelance, Bonus, Investment, Rent, Business, Education, Health, Transport, Other
- **Icon Selection**: Visual icon picker for each income source
- **Description Field**: Add detailed descriptions for each income entry
- **Analytics**: Monthly trends and category breakdown

### Expense Management
- **Categories**: Food, Transport, Shopping, Entertainment, Health, Education, Utilities, Rent, Business, Other
- **Icon Selection**: Visual icon picker for each expense category
- **Description Field**: Add detailed descriptions for each expense entry
- **Analytics**: Monthly trends and category breakdown

### Data Visualization
- **Bar Charts**: Monthly income and expense trends
- **Pie Charts**: Category-wise breakdown
- **Interactive Tooltips**: Detailed information on hover
- **Responsive Design**: Works on all device sizes

### User Experience
- **Confirmation Dialogs**: Safe deletion with confirmation
- **Loading States**: Visual feedback during operations
- **Error Handling**: User-friendly error messages
- **Responsive Design**: Mobile and desktop optimized

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- CORS configuration
- Input validation
- Error handling
- Secure file uploads

## 🚀 Deployment

### Backend Deployment
1. Set up environment variables
2. Configure MongoDB connection
3. Deploy to your preferred platform (Heroku, Vercel, etc.)

### Frontend Deployment
1. Update API base URL in production
2. Build the project: `npm run build`
3. Deploy to your preferred platform (Netlify, Vercel, etc.)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Soniya Joshi**

## 🙏 Acknowledgments

- React team for the amazing framework
- Vite for the fast build tool
- Tailwind CSS for the utility-first CSS framework
- Recharts for the beautiful chart library
- All the open-source contributors whose packages made this possible
