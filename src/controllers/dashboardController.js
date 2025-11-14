const prisma = require('../prisma/client');

exports.dashboard_get = async (req, res) => {
  try {
    const messages = await prisma.message.findMany({
      orderBy: { id: 'desc' },
      include: {
        user: true, // gives us firstname, lastname, email
      }
    });

    res.render('dashboard', {
      user: req.user,
      messages
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading dashboard");
  }
};
