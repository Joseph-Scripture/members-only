const prisma = require('../prisma/client');

exports.home_get = async (req, res) => {
  try {
    const messages = await prisma.message.findMany({
      orderBy: { id: 'desc' },
      include: { user: true }
    });

    res.render('home', {
      user: req.user,   
      messages
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading home page");
  }
};
