const prisma = require('../prisma/client')


async function getUsers() {
    const data = await prisma.user.findMany({
        // include:{
        //     messages:true
        // }
    })
    console.log(data)
    
}
getUsers()