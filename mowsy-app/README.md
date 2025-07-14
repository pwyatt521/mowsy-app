# Mowsy React Native Application

The cross-platform mobile and web application for the Mowsy platform, built with React Native and Expo. This production-ready app provides a complete marketplace for yard work services and equipment rentals within local communities.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI: `npm install -g @expo/cli`

### Development Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   # For web development
   npm run web
   
   # For mobile development
   npm start
   # Then scan QR code with Expo Go app
   ```

3. **Platform-Specific Commands**
   ```bash
   npm run android    # Android emulator
   npm run ios        # iOS simulator  
   npm run web        # Web browser
   ```

## 📱 Features

### 🔐 Authentication & User Management
- **Complete Auth Flow**: Welcome, login, and registration with JWT token management
- **Secure Token Storage**: Persistent authentication with automatic refresh
- **User Profiles**: Real user data display with ratings, reviews, and address information
- **Session Management**: Automatic session expiry handling and background state tracking

### 💼 Jobs Marketplace
- **Browse Jobs**: Real-time job listings with category filtering and location-based results
- **Post Jobs**: Full job creation with scheduling, pricing, and special notes
- **Job Applications**: Complete application flow with personalized messaging
- **Job Management**: Edit, update, and delete user's posted jobs
- **Real API Integration**: Live data from `GET /v1/jobs?filter=true` endpoint

### 🛠️ Equipment Rentals
- **Browse Equipment**: Real-time equipment listings with availability status
- **List Equipment**: Complete equipment posting with specifications and pricing
- **Equipment Management**: Full CRUD operations for user's equipment
- **Rental Requests**: Equipment rental request functionality
- **Real API Integration**: Live data from `GET /v1/equipment?filter=true` endpoint

### 🏠 Home Dashboard
- **Community Focus**: Neighborhood-centric dashboard with local insights
- **Quick Actions**: Fast access to post jobs and list equipment
- **Activity Overview**: User statistics and recent activity

### 🎨 Design Philosophy
- **Production-Ready UI**: Polished interface with consistent spacing and typography
- **Responsive Design**: Optimized for both mobile and web platforms
- **Accessibility**: High contrast, readable fonts, intuitive navigation
- **Error Handling**: Comprehensive loading states and error feedback

## 🎨 Design System

### Color Palette
- **Primary**: `#2D5A27` (Forest Green)
- **Secondary**: `#7BA05B` (Sage Green) 
- **Accent**: `#F4A261` (Warm Orange)
- **Background**: `#F8F9FA` (Off-white)
- **Text Primary**: `#2C3E50`
- **Success**: `#28A745`
- **Warning**: `#FFC107`
- **Error**: `#DC3545`

### Typography
- **Headers**: Inter Bold
- **Body**: Inter Regular
- **Buttons**: Inter SemiBold

## 🏗️ Architecture

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── common/         # Buttons, Cards, etc.
│   ├── forms/          # Input components
│   └── navigation/     # Navigation components
├── screens/            # Screen components
│   ├── auth/          # Authentication screens
│   ├── home/          # Home dashboard
│   ├── jobs/          # Jobs marketplace
│   ├── equipment/     # Equipment rentals
│   └── profile/       # User profile
├── store/             # Redux store
│   └── slices/        # RTK Query API slices
├── navigation/        # Navigation setup
├── constants/         # Colors, typography, config
└── services/          # API and external services
```

### State Management
- **Redux Toolkit**: Predictable state management
- **RTK Query**: Efficient API calls and caching
- **Redux Persist**: State persistence

### Navigation
- **React Navigation v6**: Smooth navigation experience
- **Bottom Tab Navigation**: Main app navigation
- **Stack Navigation**: Screen flows

## 🔧 Configuration

### Environment Setup

The app supports multiple environments (dev, staging, production):

```typescript
// src/constants/config.ts
const configs = {
  development: {
    apiUrl: 'https://api-dev-your-aws-gateway-url.com',
    stripeKey: 'pk_test_dev_key_here'
  },
  staging: {
    apiUrl: 'https://api-stage-your-aws-gateway-url.com', 
    stripeKey: 'pk_test_stage_key_here'
  },
  production: {
    apiUrl: 'https://api-prod-your-aws-gateway-url.com',
    stripeKey: 'pk_live_prod_key_here'
  }
};
```

### API Integration

The app is configured to work with the mowsy-api backend at:
**Base URL**: `https://p2mw409ce8.execute-api.us-east-2.amazonaws.com/dev`

#### API Endpoints:
- **Authentication**: `/v1/auth/*`
  - POST `/v1/auth/login` - User login with email/password
  - POST `/v1/auth/register` - Account creation with profile data
  - GET `/v1/auth/profile` - Get current user profile
  - PUT `/v1/auth/profile` - Update user profile
- **Jobs**: `/v1/jobs/*`
  - GET `/v1/jobs?filter=true` - Browse available jobs with filtering
  - POST `/v1/jobs` - Create new job posting
  - GET `/v1/jobs/my` - Get user's posted jobs
  - GET `/v1/jobs/:id` - Get specific job details
  - PUT `/v1/jobs/:id` - Update job posting
  - DELETE `/v1/jobs/:id` - Delete job posting
  - POST `/v1/jobs/:id/apply` - Apply to a job
- **Equipment**: `/v1/equipment/*`
  - GET `/v1/equipment?filter=true` - Browse available equipment with filtering
  - POST `/v1/equipment` - List new equipment
  - GET `/v1/equipment/my` - Get user's listed equipment
  - GET `/v1/equipment/:id` - Get specific equipment details
  - PUT `/v1/equipment/:id` - Update equipment listing
  - DELETE `/v1/equipment/:id` - Delete equipment listing
  - POST `/v1/equipment/rental-requests` - Request equipment rental

## 📚 Key Components

### Authentication Flow
- **WelcomeScreen**: Onboarding with compelling value proposition
- **LoginScreen**: Secure user authentication with error handling
- **RegisterScreen**: Complete account creation with profile setup

### Main Application Screens
- **HomeScreen**: Community-focused dashboard with quick access to core features
- **JobsScreen**: Complete job marketplace with browse/post/manage functionality
  - Browse jobs with real-time data and category filtering
  - Create and edit job postings with full form validation
  - Apply to jobs with personalized messaging system
- **EquipmentScreen**: Full equipment rental marketplace
  - Browse available equipment with real-time availability
  - List personal equipment with detailed specifications
  - Manage rental requests and equipment updates
- **ProfileScreen**: Comprehensive user profile management
  - User information display with ratings and reviews
  - Address and location information
  - Settings and account management

### Advanced Features
- **ApplyToJobScreen**: Complete job application flow with pre-filled user data
- **UpdateJobScreen**: Full job editing with form pre-population
- **UpdateEquipmentScreen**: Complete equipment editing interface
- **AddEquipmentScreen**: Comprehensive equipment listing form

### Core UI Components
- **Button**: Multiple variants (primary, secondary, text) with loading states
- **Card**: Consistent card layout with proper shadows and spacing
- **Input**: Advanced form inputs with validation, error states, and accessibility

## 🚢 Deployment

### Web Deployment
The app can be deployed as a web application using Expo's web support.

### Mobile Deployment
- **iOS**: Deploy via App Store using Expo Application Services (EAS)
- **Android**: Deploy via Google Play Store using EAS

### Environment Variables
Configure the following for production:
- API endpoints
- Stripe keys
- Google Maps API keys

## 🔐 Security Features

- Secure token storage
- Input validation and sanitization
- User verification system
- Insurance status tracking
- Community reporting features

## 🎯 Development Guidelines

### Code Style
- TypeScript for type safety
- Consistent naming conventions
- Component composition over inheritance
- Custom hooks for reusable logic

### Best Practices
- Follow existing patterns and conventions
- Use provided UI components
- Implement proper error handling
- Add loading states for async operations
- Optimize for both mobile and web platforms

## 📞 Technical Support

For development issues or questions:
- **Expo Documentation**: [https://docs.expo.dev/](https://docs.expo.dev/)
- **React Navigation**: [https://reactnavigation.org/](https://reactnavigation.org/)
- **Redux Toolkit**: [https://redux-toolkit.js.org/](https://redux-toolkit.js.org/)
- **RTK Query**: [https://redux-toolkit.js.org/rtk-query/overview](https://redux-toolkit.js.org/rtk-query/overview)

## 🎯 Future Enhancements

1. **Maps Integration**: Add Google Maps for location-based job discovery
2. **Push Notifications**: Real-time notifications for job applications and updates
3. **Payment Integration**: Stripe integration for secure transactions
4. **In-App Messaging**: Communication system between job posters and applicants
5. **Photo Upload**: Image capabilities for job postings and equipment listings
6. **Advanced Filtering**: More sophisticated search and filter options
7. **Performance Monitoring**: Analytics and crash reporting
8. **Testing Suite**: Comprehensive unit and integration test coverage

---

Built with ❤️ for the Mowsy community