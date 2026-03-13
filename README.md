# Library Management System

A comprehensive library management system built with React (frontend) and FastAPI (backend) that provides real-time dashboard updates, book management, and user authentication.

## 🏗️ Architecture

### Frontend (React + Vite)
- **React 19** with modern hooks and components
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Axios** for API communication

### Backend (FastAPI)
- **FastAPI** for REST API
- **MongoDB** for data storage
- **JWT** for authentication
- **APScheduler** for scheduled tasks

## 📁 Project Structure

```
LIBRARY_SYS/
├── library-frontend/                 # React frontend
│   ├── src/
│   │   ├── services/                 # Core business logic
│   │   │   ├── apiService.js        # HTTP client and API configuration
│   │   │   ├── authService.js       # Authentication service
│   │   │   ├── dashboardService.js  # Dashboard data management
│   │   │   └── libraryService.js    # Library operations service
│   │   ├── utils/                    # Utility functions
│   │   │   ├── formatters.js        # Data formatting utilities
│   │   │   ├── validators.js        # Data validation utilities
│   │   │   ├── dashboardUtils.js    # Dashboard helper functions
│   │   │   └── notificationUtils.js # Notification utilities
│   │   ├── components/              # Reusable UI components
│   │   ├── pages/                   # Page components
│   │   │   ├── student/            # Student-specific pages
│   │   │   ├── library/            # Library staff pages
│   │   │   ├── staff/              # College staff pages
│   │   │   └── admin/              # Administrator pages
│   │   ├── hooks/                   # Custom React hooks
│   │   ├── config/                  # Configuration files
│   │   └── assets/                  # Static assets
│   ├── public/                     # Public files
│   └── package.json                 # Dependencies
└── library-backend/                 # FastAPI backend
    ├── app/
    │   ├── models/                  # Data models
    │   ├── repositories/            # Database repositories
    │   ├── routes/                  # API routes
    │   ├── utils/                   # Backend utilities
    │   └── main.py                  # Application entry point
    ├── requirements.txt             # Python dependencies
    └── simple_main.py              # Simple server starter
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Python (v3.8 or higher)
- MongoDB

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd library-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Backend Setup

1. Navigate to backend directory:
```bash
cd library-backend
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Start the server:
```bash
python simple_main.py
```

4. API will be available at [http://localhost:8000](http://localhost:8000)

## 🎯 Features

### 📚 Library Management
- **Book Management**: Add, issue, and return books
- **Inventory Tracking**: Real-time book availability
- **Fine Management**: Calculate and collect fines
- **Reminder System**: Send reminders to students with overdue books

### 👥 User Roles
- **Students**: View issued books, pay fines, receive reminders
- **Library Staff**: Manage books, issue/return operations, send reminders
- **College Staff**: View overall library statistics
- **Administrators**: Manage users and system settings

### 📊 Real-Time Dashboard
- **Live Statistics**: Automatic updates when books are issued/returned
- **Role-Based Views**: Different dashboards for different user types
- **Color-Coded Themes**: Orange (Student), Blue (Library), Green (College)
- **Recent Activity**: Track all library operations in real-time

### 🔔 Notification System
- **Email Reminders**: Automated reminders for overdue books
- **In-App Notifications**: Real-time updates and success messages
- **Toast Notifications**: User-friendly feedback for all actions

## 🛠️ Development

### Services vs Utils

**Services** (`src/services/`):
- Core business logic
- API communication
- Data management
- Authentication and authorization

**Utils** (`src/utils/`):
- Helper functions
- Data formatting
- Validation utilities
- Notification helpers

### Code Organization

- **Modular Architecture**: Separated concerns between services and utilities
- **Reusable Components**: Consistent UI across all pages
- **Custom Hooks**: Encapsulated state management
- **Error Handling**: Comprehensive error management

## 🔐 Authentication

- **JWT Tokens**: Secure authentication mechanism
- **Role-Based Access**: Different permissions for different user types
- **Session Management**: Automatic token refresh and logout

## 📱 Responsive Design

- **Mobile-Friendly**: Works on all device sizes
- **Modern UI**: Clean, professional interface
- **Accessibility**: WCAG compliant components
- **Performance**: Optimized for fast loading

## 🧪 Testing

- **Unit Tests**: Component and utility testing
- **Integration Tests**: API endpoint testing
- **E2E Tests**: Full user journey testing

## 📈 Monitoring

- **Real-Time Updates**: Live dashboard synchronization
- **Error Tracking**: Comprehensive error logging
- **Performance Metrics**: Application performance monitoring

## 🚀 Deployment

### Frontend Deployment
```bash
npm run build
```

### Backend Deployment
```bash
uvicorn simple_main:app --host 0.0.0.0 --port 8000
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please open an issue in the repository.

---

**Built with ❤️ using React, FastAPI, and MongoDB**
