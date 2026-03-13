# Library Management System - Complete Setup Guide

## Environment Configuration

### Backend (.env)
```env
DEBUG=true
MONGO_URI=mongodb+srv://neilborikar:Neil%403025@cluster0.fxogrnh.mongodb.net/?retryWrites=true&w=majority
MONGO_DB_NAME=library_management_system
JWT_SECRET=a3f9b6e4d1c7a0e9b2f8d6c5e4a7b1c3d9f2e0a8c6b5
JWT_EXPIRY_MINUTES=60
BACKEND_HOST=localhost
BACKEND_PORT=8004
```

### Frontend (.env.local)
```env
VITE_API_BASE_URL=http://localhost:8004/api
VITE_APP_NAME=Library Management System
VITE_APP_VERSION=1.0.0
VITE_DEV_MODE=true
VITE_DEBUG_MODE=true
```

## Database Setup

### Collections Created:
- **users**: All user accounts (admin, staff, library_staff, student)
- **books**: Library book inventory
- **transactions**: Book issue/return records
- **fines**: Fine payment records

### Default Users:
- **Admin**: admin@college.edu / admin123
- **Staff**: staff@college.com / staff123
- **Library**: library@college.edu / library123
- **Student**: student@college.edu / student123

### Default Books:
- Python Programming (5 copies)
- Data Structures (3 copies)
- Algorithms (4 copies)

## API Endpoints

### Authentication (/api/auth)
- **POST /login**: User login with JWT token
- **POST /register**: User registration
- **GET /me**: Get current user info

### Library Staff (/api/library)
- **GET /books-issued**: Get all issued books
- **POST /issue-book**: Issue new book
- **POST /return-book**: Return book
- **POST /add-book**: Add new book to inventory
- **GET /dashboard**: Library dashboard statistics

### Staff (/api/staff)
- **GET /books-issued**: Get staff's issued books
- **GET /books-returned**: Get staff's returned books
- **GET /dashboard**: Staff dashboard data

### Student (/api/student)
- **GET /books-issued**: Get student's issued books
- **GET /books-returned**: Get student's returned books
- **GET /dashboard**: Student dashboard data

### Admin (/api/admin)
- **GET /dashboard**: Admin dashboard statistics
- **GET /users**: Get all users
- **POST /manage**: User management operations

## Frontend Routes

### Admin Routes
- /admin/login → AdminLogin
- /admin/dashboard → AdminDashboard
- /admin/library-staff → AdminLibraryStaff
- /admin/students → AdminStudents
- /admin/staff → AdminStaff
- /admin/reports → AdminReports

### Library Staff Routes
- /library/login → LibraryLogin
- /library/dashboard → LibraryDashboardEnhanced
- /library/books-issued → BooksIssued
- /library/books-returned → BooksReturned
- /library/fine-collected → FineCollected
- /library/add-book → AddBook
- /library/all-books → ViewAllBooks

### Staff Routes
- /staff/login → StaffLogin
- /staff/register → StaffRegister
- /staff/dashboard → CollegeStaffDashboard
- /staff/books-issued → StaffBooksIssued
- /staff/books-returned → StaffBooksReturned

### Student Routes
- /student/login → StudentLogin
- /student/register → StudentRegister
- /student/dashboard → StudentDashboardEnhanced
- /student/books-issued → StudentBooksIssued
- /student/books-returned → StudentBooksReturned
- /student/fine-paid → StudentFinePaid

## Testing Instructions

### 1. Start Backend
```bash
cd library-backend
python -m uvicorn simple_main:app --host 0.0.0.0 --port 8004 --reload
```

### 2. Start Frontend
```bash
cd library-frontend
npm run dev
```

### 3. Test Login
1. Open http://localhost:5174
2. Click on any portal (Admin/Staff/Library/Student)
3. Use default credentials from above
4. Verify dashboard loads correctly

### 4. Test Functionality
1. **Library Staff**: Issue/return books, add books
2. **Staff**: View issued books, dashboard
3. **Student**: View personal books, dashboard
4. **Admin**: View statistics, manage users

## Key Features Implemented

### ✅ Authentication
- JWT-based login system
- Role-based access control
- Password hashing with bcrypt
- Session management

### ✅ Database Integration
- MongoDB connection with Atlas
- Automatic data initialization
- Real-time data synchronization
- Error handling and fallbacks

### ✅ Frontend Routing
- React Router with proper navigation
- Protected routes based on roles
- Responsive design with Tailwind CSS
- Loading states and error handling

### ✅ API Endpoints
- RESTful API design
- Proper HTTP status codes
- Request/response validation
- CORS configuration

### ✅ UI/UX
- Modern, responsive design
- Smooth animations with Framer Motion
- Consistent color scheme
- Mobile-friendly layout

## Troubleshooting

### Common Issues:
1. **Database Connection**: Check MongoDB URI and network
2. **CORS Errors**: Verify frontend URL in CORS config
3. **Authentication**: Check JWT secret and token handling
4. **Missing Data**: Run database initialization

### Debug Mode:
- Backend: DEBUG=true in .env
- Frontend: VITE_DEBUG_MODE=true in .env.local
- Check browser console for API calls
- Check network tab for HTTP requests

## Next Steps

1. **Production Deployment**: Configure production database
2. **Email Integration**: Set up SMTP for notifications
3. **File Upload**: Add book cover image upload
4. **Advanced Features**: Book reservations, waitlists
5. **Analytics**: Add usage tracking and reports
