const prisma = require('../prisma/client');

exports.createMessage = async (req, res) => {
  try {
    if (!req.user) return res.redirect('/auth/login');

    const { content } = req.body;

    await prisma.message.create({
      data: {
        content,
        userId: req.user.id
      }
    });

    res.redirect('/dashboard');

  } catch (err) {
    console.error(err);
    res.status(500).send("Could not create message");
  }
};
