const bcrypt = require('bcryptjs');
const prisma = require('../prisma/client');
const passport = require('passport');
exports.signup_post = async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;

    // Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;

    if (!passwordRegex.test(password)) {
      return res.render("signup", {
        error: "Password must be at least 8 chars, include uppercase, lowercase, and a special character.",
        success: null
      });
    }

    // Check if email exists
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return res.render("signup", { 
        error: "Email already in use.",
        success: null
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { firstname, lastname, email, password: hashedPassword }
    });

    req.login(user, err => {
      if (err) {
        return res.render("signup", { error: "Error logging in after signup.", success: null });
      }

      return res.render("success", {
        success: "Signup successful! Redirecting...",
        error: null,
        redirectUrl: "/dashboard"
      });
    });

  } catch (err) {
    console.error(err);
    return res.render("signup", { error: "Server error.", success: null });
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
