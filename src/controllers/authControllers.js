const bcrypt = require('bcryptjs');
const prisma = require('../prisma/client');
const passport = require('passport');

exports.signup_post = async (req, res) => {
  try {
    const { firstname, lastname, password } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findFirst({ where: { firstname } });
    if (existingUser) {
      return res.render('signup', { error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await prisma.user.create({
      data: { firstname, lastname, password: hashedPassword },
    });

    // Automatically log in user after signup
    req.login(user, (err) => {
      if (err) {
        console.error(err);
        return res.render('signup', { error: 'Login after signup failed' });
      }

      // Render success page with popup + redirect
      return res.render('success', {
        message: 'Signup successful!',
        redirectUrl: '/dashboard'
      });
    });

  } catch (err) {
    console.error(err);
    res.render('signup', { error: 'Server error during signup' });
  }
};

exports.login_post = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      return res.render('login', { error: info.message || 'Login failed' });
    }

    // Establish a login session
    req.logIn(user, (err) => {
      if (err) return next(err);

      // Render success page with popup + redirect
      return res.render('success', {
        message: 'Login successful!',
        redirectUrl: '/dashboard'
      });
    });
  })(req, res, next);
};

// ---------- LOGOUT ----------
exports.logout_get = (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error(err);
      return res.redirect('/'); 
    }

    // Render success page with popup + redirect
    res.render('success', {
      message: 'Logout successful!',
      redirectUrl: '/'
    });
  });
};
