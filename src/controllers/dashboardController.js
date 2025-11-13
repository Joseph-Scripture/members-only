exports.dashboard_get = (req, res) => {
    if (!req.isAuthenticated()) {
      return res.redirect('/auth/login');
    }
  
    // Render dashboard view with user info
    res.render('dashboard', { user: req.user });
  };
  