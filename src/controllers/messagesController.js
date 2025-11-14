const prisma = require('../prisma/client');

exports.createMessage = async (req, res) => {
  try {
    if (!req.user) {
      return res.redirect('/auth/login');
    }

    const { content } = req.body;

    const message = await prisma.message.create({
      data: {
        content,
        userId: req.user.id
      }
    });

    // Redirect back to dashboard or home
    res.redirect('/dashboard');

  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating message");
  }
};
