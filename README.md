# ⏱️ TimeSnap

**TimeSnap** is a full-stack time tracking and task management application built for students and teachers. It allows students to manage their tasks with a built-in timer and export their timesheet, while teachers can monitor student progress and export detailed reports per course.

---

## 🌐 Live Preview

- 🔗 **Frontend (Client):** [timesnap-client.vercel.app](https://timesnap-client.vercel.app)
- 🔗 **Backend (Admin Panel):** [timesnap.onrender.com](https://timesnap.onrender.com)

---

## 📌 Features

### 👨‍🏫 Teacher Dashboard
- Add/edit/delete courses
- View all students enrolled in each course
- View timesheets per course

### 👩‍🎓 Student Dashboard
- Select a course and create tasks
- Start/stop task timer (with pause/resume)
- Mark tasks as done
- Edit task title
- Export completed task timesheet (Excel)

### 🛠 Admin
- View all users, tasks, and courses
- Monitor task logs with timestamps

---

## 🛠️ Technologies Used

### Backend
- Node.js
- Prisma ORM
- PostgreSQL

### Frontend
- React
- Modern JavaScript/TypeScript

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL database

### 1. Clone the Repository

```bash
git clone https://github.com/dignapatel0/TimeSnap.git
cd TimeSnap
```

### 2. Set Up the Backend

Navigate to the server directory and install dependencies:

```bash
cd timesnap-server
npm install
```

#### Database Setup

1. Create a `.env` file in the `timesnap-server` directory:

```env
DATABASE_URL=your_postgresql_connection_url
```

Replace `your_postgresql_connection_url` with your actual PostgreSQL connection string, for example:
```
DATABASE_URL="postgresql://username:password@localhost:5432/timesnap_db"
```

2. Run database migrations and generate Prisma client:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

3. Start the backend server:

```bash
npm run dev
```

The backend server should now be running on `http://localhost:5000` (or your configured port).

### 3. Set Up the Frontend

Open a new terminal window and navigate to the client directory:

```bash
cd timesnap-client
npm install
```

Start the frontend development server:

```bash
npm run dev
```

The frontend application should now be running on `http://localhost:5173` (or the next available port).

## 📝 Available Scripts

### Backend (`timesnap-server`)
- `npm run dev` - Start the development server
- `npx prisma migrate dev` - Run database migrations
- `npx prisma generate` - Generate Prisma client
- `npx prisma studio` - Open Prisma Studio (database GUI)

### Frontend (`timesnap-client`)
- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 👤 Author

**Digna Patel**
- GitHub: [@dignapatel0](https://github.com/dignapatel0)

