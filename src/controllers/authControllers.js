const bcrypt = require('bcryptjs');
const prisma = require('../prisma/client');
const passport = require('passport');
const { validationResult } = require('express-validator');

exports.signup_post = async (req, res) => {
  // Handle validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('signup', { 
      error: errors.array()[0].msg,  // Show the first error
      success: null
    });
  }

  const { firstname, lastname, email, password } = req.body;

  try {
    // Check if email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.render('signup', { error: 'Email already in use', success: null });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { firstname, lastname, email, password: hashedPassword }
    });

    req.login(user, err => {
      if (err) return res.render('signup', { error: 'Login after signup failed', success: null });

      return res.render('success', {
        message: 'Signup successful! Redirecting...',
        redirectUrl: '/dashboard',
        error: null
      });
    });
  } catch (err) {
    console.error(err);
    res.render('signup', { error: 'Server error', success: null });
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
        success: 'Login successful! Redirecting ....',
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
      success: 'Logout successful! Redirecting ...',
      redirectUrl: '/',
      error:null
    });
  });
};
