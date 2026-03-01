# DailyDo - Task Management Dashboard

A full-stack Task Management Dashboard built with React, TypeScript, Node.js, and PostgreSQL. Secure, type-safe, and designed for both personal and team task management.

## 🚀 Features

### Authentication & Onboarding
- **User Registration & Login** - Secure JWT-based authentication
- **Onboarding Flow** - Choose between Personal or Team workspace
- **Protected Routes** - Authenticated access to dashboard

### Task Management
- **Create Tasks** - Add tasks with title, description, priority, and due date
- **Task Status Tracking** - TODO → IN PROGRESS → DONE workflow
- **Priority Levels** - LOW, MEDIUM, HIGH with visual indicators
- **Due Date Tracking** - Calendar integration for deadlines

### Team Collaboration
- **Create Teams** - Collaborate with team members
- **Team Tasks** - View and manage team-assigned tasks
- **Role Management** - OWNER, MEMBER, VIEWER roles

### Dashboard & Analytics
- **Weekly Analytics** - Visual charts showing task completion trends
- **Calendar View** - Interactive calendar with task deadlines
- **Workflow Banner** - Real-time workflow status overview
- **Task Filtering** - Search, sort, and filter by status/priority

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **React Router** - Navigation
- **Recharts** - Analytics charts

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **TypeScript** - Type safety
- **Prisma ORM** - Database access
- **PostgreSQL** - Database
- **JWT** - Authentication
- **bcrypt** - Password hashing

## 📁 Project Structure

```
task-dashboard/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma          # Database schema
│   ├── src/
│   │   ├── controllers/           # Business logic
│   │   │   ├── authController.ts
│   │   │   ├── taskController.ts
│   │   │   └── teamController.ts
│   │   ├── middleware/
│   │   │   └── auth.ts            # JWT authentication
│   ├── routes/                    # API routes
│   │   ├── auth.ts
│   │   ├── tasks.ts
│   │   └── teams.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   └── prisma.ts
│   ├── index.ts                   # Server entry
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── dashboard/         # Dashboard components
│   │   │   │   ├── DashboardLayout.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── Topbar.tsx
│   │   │   │   ├── WorkflowBanner.tsx
│   │   │   │   ├── WeeklyAnalytics.tsx
│   │   │   │   ├── TaskCalendar.tsx
│   │   │   │   └── useWeeklyAnalytics.ts
│   │   │   ├── tasks/             # Task components
│   │   │   │   ├── TaskBoard.tsx
│   │   │   │   ├── TaskCard.tsx
│   │   │   │   ├── TaskControls.tsx
│   │   │   │   ├── CreateTaskModal.tsx
│   │   │   │   ├── CreateTeamModal.tsx
│   │   │   │   └── sidebar/
│   │   │   │       └── TeamsList.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── Hero.tsx
│   │   │   └── ...
│   │   ├── pages/
│   │   │   ├── Landing.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Signup.tsx
│   │   │   ├── Onboarding.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── MyTasksPage.tsx
│   │   │   └── TeamPage.tsx
│   │   ├── stores/
│   │   │   └── authStore.ts       # Zustand auth state
│   │   ├── lib/
│   │   │   ├── api.ts
│   │   │   └── axios.ts
│   │   ├── types/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── docker-compose.yml
├── package.json
└── README.md
```

## 🔧 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- npm or yarn

### Backend Setup

```
bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
DATABASE_URL=postgresql://user:password@localhost:5432/dailydb
JWT_SECRET=your_super_secret_key
PORT=5000

# Run Prisma migrations
npx prisma migrate dev

# Start development server
npm run dev
```

### Frontend Setup

```
bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at: **http://localhost:5173**

##  API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks |
| POST | `/api/tasks` | Create new task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |

### Teams
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/teams` | Get user teams |
| POST | `/api/teams` | Create new team |

## 🔐 Security Features

- **Password Hashing** - bcrypt for secure password storage
- **JWT Tokens** - Stateless authentication
- **Protected Routes** - Middleware validation
- **Type Safety** - Full TypeScript implementation
- **Environment Variables** - Sensitive data protection

## 📊 Database Schema

### User
- id, email, name, password
- timestamps (createdAt, updatedAt)

### Team
- id, name, description, ownerId
- timestamps

### Task
- id, title, description, priority, status, dueDate, order
- userId, teamId, assigneeId
- timestamps

### TeamMember
- id, userId, teamId, role (OWNER/MEMBER/VIEWER)

