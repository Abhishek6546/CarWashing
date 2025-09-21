# 🚗 CarWash Pro - MERN Stack Booking System

A full-stack car wash booking management system built with the MERN stack (MongoDB, Express.js, React, Node.js). This application allows users to create, manage, and track car wash service bookings with a clean, responsive interface.

## 🌟 Features

### Core Functionality
- **CRUD Operations**: Create, read, update, and delete car wash bookings
- **Advanced Search**: Real-time search by customer name, car make, and model
- **Smart Filtering**: Filter by service type, car type, status, and date range
- **Pagination**: Efficient data display with 9 bookings per page
- **Responsive Design**: Mobile-first approach with Tailwind CSS

### Booking Management
- **Service Types**: Basic Wash, Deluxe Wash, Full Detailing
- **Add-on Services**: Interior cleaning, polishing, wax protection, etc.
- **Dynamic Pricing**: Automatic price calculation based on service and add-ons
- **Status Tracking**: Pending, Confirmed, Completed, Cancelled
- **Rating System**: 1-5 star rating for completed services
- **Time Slots**: Pre-defined booking slots from 8 AM to 5 PM

### User Experience
- **Real-time Updates**: Toast notifications for all actions
- **Loading States**: Skeleton loaders and progress indicators
- **Error Handling**: Comprehensive error messages and retry options
- **Confirmation Dialogs**: Safe deletion with confirmation prompts

## 🛠 Tech Stack

### Frontend
- **React 18** - UI library with hooks
- **Vite** - Fast build tool and dev server
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form** - Form validation and management
- **Axios** - HTTP client for API requests
- **React Hot Toast** - Toast notifications
- **Lucide React** - Beautiful icons

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Express Validator** - Input validation middleware
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logger
- **Helmet** - Security middleware

## 📁 Project Structure

```
carwash-booking/
├── backend/
│   ├── models/
│   │   └── Booking.js
│   ├── routes/
│   │   └── bookings.js
│   ├── middleware/
│   │   └── errorHandler.js
│   ├── seeds/
│   │   └── bookings.js
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── BookingCard.jsx
│   │   │   ├── BookingForm.jsx
│   │   │   ├── FilterSidebar.jsx
│   │   │   ├── Layout.jsx
│   │   │   ├── Loading.jsx
│   │   │   ├── Pagination.jsx
│   │   │   └── SearchBar.jsx
│   │   ├── pages/
│   │   │   ├── AddBooking.jsx
│   │   │   ├── BookingDetail.jsx
│   │   │   ├── EditBooking.jsx
│   │   │   └── HomePage.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd carwash-booking
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Create .env file
   cp .env.example .env
   
   # Update .env with your MongoDB connection string
   MONGODB_URI=mongodb://localhost:27017/carwash
   PORT=5000
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   
   # Create .env file (optional)
   cp .env.example .env
   
   # Update .env for production API URL
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Database Seeding**
   ```bash
   # In backend directory
   npm run seed
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   npm run dev
   # Server runs on http://localhost:5000
   ```

2. **Start the Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   # Client runs on http://localhost:3000
   ```

3. **Open your browser** and navigate to `http://localhost:3000`

## 🔧 Available Scripts

### Backend
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Populate database with sample data

### Frontend
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📊 API Endpoints

### Bookings
- `GET /api/bookings` - Get all bookings (with filtering and pagination)
- `GET /api/bookings/search?q=query` - Search bookings
- `GET /api/bookings/:id` - Get single booking
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Delete booking

### Query Parameters
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `serviceType` - Filter by service type
- `carType` - Filter by car type
- `status` - Filter by booking status
- `dateFrom` - Filter by start date
- `dateTo` - Filter by end date
- `sortBy` - Sort field (default: createdAt)
- `sortOrder` - Sort order: asc/desc (default: desc)

## 💾 Database Schema

### Booking Model
```javascript
{
  customerName: String (required),
  carDetails: {
    make: String (required),
    model: String (required),
    year: Number (required),
    type: String (enum: sedan, suv, hatchback, luxury, pickup, convertible)
  },
  serviceType: String (enum: Basic Wash, Deluxe Wash, Full Detailing),
  date: Date (required),
  timeSlot: String (enum: 08:00-17:00),
  duration: Number (minutes),
  price: Number (calculated automatically),
  status: String (enum: Pending, Confirmed, Completed, Cancelled),
  rating: Number (1-5, optional),
  addOns: [String] (array of add-on services),
  createdAt: Date,
  updatedAt: Date
}
```

## 🎨 UI Components

### Key Components
- **BookingCard** - Displays booking information in a card format
- **BookingForm** - Reusable form for creating/editing bookings
- **SearchBar** - Real-time search with debouncing
- **FilterSidebar** - Advanced filtering options
- **Pagination** - Navigate through booking pages
- **Loading** - Loading states and skeleton screens

### Design System
- **Colors**: Primary blue theme with semantic status colors
- **Typography**: Inter font family for clean readability
- **Spacing**: Consistent spacing scale using Tailwind
- **Components**: Reusable utility classes for buttons, forms, cards

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: < 640px (sm)
- **Tablet**: 640px - 1024px (md-lg)
- **Desktop**: > 1024px (xl+)

### Mobile Features
- Collapsible filter sidebar
- Touch-friendly interface
- Optimized card layouts
- Mobile navigation menu

## 🔒 Data Validation

### Frontend Validation
- React Hook Form with custom validation rules
- Real-time field validation
- Form submission prevention on errors

### Backend Validation
- Express Validator middleware
- MongoDB schema validation
- Custom business logic validation
- Comprehensive error messages

## 🚨 Error Handling

### Frontend
- Toast notifications for user feedback
- Error boundaries for component failures
- Graceful degradation for network issues
- Retry mechanisms for failed requests

### Backend
- Centralized error handling middleware
- Detailed error logging
- Consistent API error responses
- Input validation and sanitization

## 🎯 Performance Optimizations

### Frontend
- Component code splitting
- Image lazy loading
- Debounced search queries
- Efficient re-rendering with React hooks
- Vite's fast bundling and HMR

### Backend
- MongoDB indexing for search performance
- Pagination to limit data transfer
- Request caching headers
- Optimized database queries

## 🧪 Sample Data

The application includes sample bookings showcasing:
- Different car types (sedan, SUV, luxury, etc.)
- Various service types and combinations
- Different booking statuses and dates
- Realistic customer data and pricing



## 🔗 Links
- **Live Demo**: [Add your deployed application URL]
---

