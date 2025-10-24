# AgriJobs - Agricultural Job Platform for Uganda

A modern, user-friendly web platform that connects agricultural job seekers with employers in Uganda's farming sector. Built with Next.js, TypeScript, and Tailwind CSS.

## 🌾 Overview

AgriJobs bridges the gap between agricultural employers and skilled workers across Uganda, promoting transparency, trust, and equal opportunity in rural job access. The platform highlights agriculture as a modern and profitable career path, specifically tailored for Uganda's agricultural landscape including coffee farming, dairy production, organic vegetables, and traditional crops.

## ✨ Features

### 🏠 Landing Page
- Hero section with compelling tagline "Connecting Hands That Grow the Nation"
- Dual search functionality for jobs and workers
- Featured jobs showcase
- How it works section
- User testimonials
- AI-powered chatbot assistant

### 👤 Job Seeker Dashboard
- Professional profile management with skills and experience
- AI-powered job recommendations based on skills and location
- Application tracking with status updates
- Job search with advanced filtering
- Skills and certification management

### 🏢 Employer Dashboard
- Job posting with detailed requirements and benefits
- AI-assisted candidate recommendations
- Application management and candidate shortlisting
- Messaging system for candidate communication
- Analytics and insights

### 👨‍💼 Admin Panel
- User management (job seekers, employers, admins)
- Job moderation and management
- Analytics dashboard with regional trends
- Skills demand analysis
- Monthly trend tracking

### 🤖 AI Features
- Smart job matching based on skills, location, and preferences
- Interactive chatbot for user assistance
- Candidate recommendation engine
- Skills gap analysis

### 🔐 Authentication & User Management
- **Email-based authentication** with secure password handling
- **Role-based access control** for Job Seekers, Employers, and Admins
- **Multi-organization support** - users can belong to multiple farms/cooperatives
- **Organization roles**: Owner, Manager, Recruiter, Viewer
- **Session management** with automatic login persistence
- **Demo credentials**: `demo@agrijobs.ug` / `demo123`

## 🛠️ Technical Stack

- **Frontend**: Next.js 15 with App Router
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Icons**: Lucide React
- **UI Components**: Custom components with Headless UI
- **Animations**: Framer Motion
- **Font**: Inter

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd agrijobs
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Pages & Routes

- `/` - Landing page with hero section and featured content
- `/jobs` - Job listings with search and filtering
- `/candidates` - Worker profiles and search
- `/about` - About page with mission and contact form
- `/dashboard/job-seeker` - Job seeker dashboard
- `/dashboard/employer` - Employer dashboard  
- `/dashboard/admin` - Admin panel

## 🎨 Design System

### Colors
- **Primary Green**: `#16a34a` (green-600)
- **Secondary**: Earthy browns and light neutrals
- **Accent**: Various shades for different UI elements

### Typography
- **Font**: Inter (clean, modern, friendly)
- **Hierarchy**: Clear heading and body text sizing

### Components
- Consistent card-based layouts
- Hover effects and smooth transitions
- Mobile-first responsive design
- Accessible color contrasts

## 🔧 Key Components

### UI Components
- `Button` - Consistent button styling with variants
- `Card` - Flexible card component with header/content/footer
- `Input` - Form input with focus states
- `Navigation` - Responsive navigation with mobile menu

### Page Components
- `HeroSection` - Landing page hero with search functionality
- `FeaturedJobs` - Job showcase cards
- `HowItWorks` - Process explanation
- `Testimonials` - User feedback display
- `Chatbot` - AI assistant for user help

## 📊 Data Structure

The platform uses Uganda-specific mock data to demonstrate functionality:

- **Users**: Job seekers, employers, and admins from across Uganda's regions
- **Jobs**: Agricultural positions including coffee farming, dairy production, organic vegetables, and equipment operation
- **Applications**: Job applications with status tracking
- **Analytics**: Platform usage and trend data by Uganda's regions (Central, Eastern, Western, Northern)
- **Salaries**: Realistic salary ranges in Ugandan Shillings (UGX)
- **Locations**: Real districts and regions across Uganda

## 🌟 Key Features Demonstrated

1. **Responsive Design**: Mobile-first approach with smooth animations
2. **User Experience**: Intuitive navigation and clear information hierarchy
3. **AI Integration**: Smart matching and chatbot assistance
4. **Real-time Updates**: Application status tracking and notifications
5. **Accessibility**: Proper contrast ratios and keyboard navigation

## 🚀 Deployment

The application is ready for deployment on platforms like:
- Vercel (recommended for Next.js)
- Netlify
- AWS Amplify

## 📈 Future Enhancements

- Real backend integration with database
- User authentication and authorization
- Payment processing for premium features
- Advanced AI matching algorithms
- Mobile app development
- Video interview integration
- Skills assessment tools

## 🤝 Contributing

This is a prototype demonstration. For production use, consider:
- Adding proper error handling
- Implementing real authentication
- Adding comprehensive testing
- Setting up CI/CD pipelines
- Adding monitoring and analytics

## 📄 License

This project is a demonstration prototype. Please ensure proper licensing for production use.

---

**AgriJobs** - Connecting Hands That Grow the Nation 🌾