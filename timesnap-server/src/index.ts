import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import session from 'express-session';
import flash from 'connect-flash';
import expressLayouts from 'express-ejs-layouts';

import { userRouter } from './routes/user-router';
import { courseRouter } from './routes/course-router';
import { taskRouter } from './routes/task-router';
import { adminRouter } from './routes/admin-router';
import { adminAuthRouter } from './routes/admin-auth-router';
import { teacherRouter } from './routes/teacher-router';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('tiny'));

app.use(cors({
  origin: [
    'http://localhost:5173',               // local dev
    'https://timesnap-client.vercel.app'   // your deployed frontend
  ],
  credentials: true
}));

// Session + Flash middleware BEFORE routes
const isProduction = process.env.NODE_ENV === 'production';

app.use(session({
  secret: 'timesnap_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: isProduction,         // Use secure only in production (HTTPS)
    sameSite: isProduction ? 'none' : 'lax' // Lax for dev, none for prod (cross-origin)
  }
}));


app.use(flash());
app.use((req, res, next) => {
  res.locals.flash = req.flash();
  res.locals.admin = req.session.admin;
  next();
});

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout');

// Routes
app.use('/user', userRouter);
app.use('/course', courseRouter);
app.use('/task', taskRouter);
app.use('/admin', adminRouter);
app.use('/admin', adminAuthRouter);
app.use('/teacher', teacherRouter);

// Health check
app.get('/', (req, res) => {
   res.redirect('/admin/login');
});

// Start server
app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});
