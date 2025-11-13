const prisma = require('../prisma/client');

async function createMessage(req, res){
    const {content} = req.body;
    
    const createMessage = prisma.message.create({
        data:{
            content,
            include:{
                user:req.user
            }
        }

    })

}
module.exports = createMessage