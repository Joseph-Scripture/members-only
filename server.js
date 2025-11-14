require('dotenv').config();
const express = require('express');
const path = require('node:path')
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy
const prisma = require('./src/prisma/client')
const bcrypt = require('bcryptjs');


// Importing Routes
const userRouter = require('./src/routes/userRoutes');
const homeRouter = require('./src/routes/homeRoute')
const messageRouter = require('./src/routes/messagesRoutes');
const dashboardRouter = require('./src/routes/dashboardRoutes');





PORT = process.env.PORT || 3000;

// Don't spend a lot of time wondering how people perceive you it'll change eventually as long as you keep on winning
// 693667272

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// authentication logic

app.use(session({
    secret: 'cats',
    resave: false,
    saveUninitialized: false
  }));
  
  // Initialize Passport
  app.use(passport.initialize());
  app.use(passport.session());
  
  passport.use(new LocalStrategy(
    { usernameField: 'email' },   // IMPORTANT
    async function(email, password, done) {
      try {
        const user = await prisma.user.findUnique({
          where: { email }
        });
  
        if (!user) {
          return done(null, false, { message: 'Email not found.' });
        }
  
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          return done(null, false, { message: 'Incorrect password.' });
        }
  
        return done(null, user);
  
      } catch (err) {
        return done(err);
      }
    }
  ));
  
  // Serialize and deserialize users for sessions
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await prisma.user.findUnique({ where: { id } });
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
  
// Routes
app.use('/auth', userRouter);
app.use('/', homeRouter);
app.use('/messages', messageRouter);
app.use('/dashboard', dashboardRouter);
app.use('/dashboard', dashboardRouter);
  

app.listen(PORT, (error) => {
    if (error){
        throw error
    }
    console.log('server running ', PORT)
})