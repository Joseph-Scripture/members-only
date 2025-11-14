const bcrypt = require('bcryptjs');
const prisma = require('../prisma/client');
const passport = require('passport');
exports.signup_post = async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.render('signup', { error: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        firstname,
        lastname,
        email,
        password: hashedPassword
      }
    });

    // Auto-login after signup
    req.login(user, (err) => {
      if (err) return res.render('signup', { error: 'Login failed' });

      res.render('success', {
        message: `Welcome aboard, ${user.firstname}!`,
        redirectUrl: '/dashboard'
      });
    });

  } catch (err) {
    console.error(err);
    res.render('signup', { error: 'Server error. Try again.' });
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
