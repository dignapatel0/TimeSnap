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

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));

// Session + Flash middleware BEFORE routes
app.use(session({
  secret: 'timesnap_secret_key',
  resave: false,
  saveUninitialized: false
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

// Health check
app.get('/', (req, res) => {
   res.redirect('/admin/login');
});

// Start server
app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});
