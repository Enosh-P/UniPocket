import { db } from "../src/utils/db.server"

async function seed() {

  let randID: number = 0
  let checkUser = Math.floor(Math.random()*100) + 1
  while (randID == 0) {
    if (await db.user.findUnique({
      where: {
        id: checkUser,
      },
      select: {
        id: true
      }
    })) {
      checkUser = Math.floor(Math.random()*100) + 1
    } else {
      randID = checkUser
    }
  }
  const user = await db.user.create({
      data: {
        id: randID,
        name: "Test User#"+randID
      }
    })
  const lecture = await db.lecture.create({
  data: {
      name: "WebDev 2022",
      description: "This is an optional parameter, but we will specify it anyways"
  }
  });
  const question = await db.question.create({
      data: {
        lecture: lecture.id,
        author: user.id,
        textContent: "Is this a question?"
      }
    });
  await db.vote.create({
      data: {
          vote: 1,
          user: user.id,
          question: question.id,
      },
  });
  await db.mood.create({
      data: {
          value: "sad",
          user: user.id,
          lecture: lecture.id,
      },
  });
  const admin_found = await db.authenticator.findUnique({
    where: {
      user: "admin"
    },
    select: {
      user: true,
      secret: true,
    }
  })
  if (!admin_found){
    await db.authenticator.create({
      data: {
          user: "admin",
          pass: "s3cr3tC0de!",
          secret: "90dsa9dsaj0dusajv"
      },
  });
  }
    
}

seed()
  .then(async () => {
    await db.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await db.$disconnect()
    process.exit(1)
  })