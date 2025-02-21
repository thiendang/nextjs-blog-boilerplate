import { PrismaClient, Prisma } from '@prisma/client';
import { hashSync } from 'bcryptjs';

const prisma = new PrismaClient();
const password = hashSync('password', 10);

const userData: Prisma.UserCreateInput[] = [
  {
    name: 'user0 name',
    username: 'user0',
    email: 'user0@email.com',
    image: 'avatar0.jpg',
    password,
    role: 'admin',
    posts: {
      create: [
        {
          title: 'Join the Prisma Slack',
          content: 'https://slack.prisma.io',
          published: true,
        },
      ],
    },
  },
  {
    name: 'user1 name',
    username: 'user1',
    email: 'user1@email.com',
    image: 'avatar1.jpg',
    password,
    posts: {
      create: [
        {
          title: 'Follow Prisma on Twitter',
          content: 'https://www.twitter.com/prisma',
          published: true,
        },
      ],
    },
  },
  {
    name: 'user2 name',
    username: 'user2',
    email: 'user2@email.com',
    image: 'avatar2.jpg',
    password,
    posts: {
      create: [
        {
          title: 'Ask a question about Prisma on GitHub',
          content: 'https://www.github.com/prisma/prisma/discussions',
          published: true,
        },
        {
          title: 'Prisma on YouTube',
          content: 'https://pris.ly/youtube',
        },
      ],
    },
  },
];

async function main() {
  console.log(`Start seeding ...`);
  for (const u of userData) {
    const user = await prisma.user.create({
      data: u,
    });
    console.log(`Created user with id: ${user.id}`);
  }
  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
