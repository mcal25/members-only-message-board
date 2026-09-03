import { prisma } from "./prisma/lib/prisma.js";

async function main() {
  // Create a new user with a post
  const user = await prisma.users.create({
    data: {
      firstname: "Alice",
      lastname: "Wonderland",
      username: "alice@prisma.io",
      password: "123",
      messages: {
        create: {
          title: "My current wondervibes",
          text: "I'M IN WONDERLAND YEEE HAWWW",
        },
      },
    },
    include: {
      messages: true,
    },
  });
  console.log("Created user:", user);

  // Fetch all users with their posts
  const allUsers = await prisma.user.findMany({
    include: {
      messages: true,
    },
  });
  console.log("All users:", JSON.stringify(allUsers, null, 2));
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });