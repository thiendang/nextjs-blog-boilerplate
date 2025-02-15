import { hash } from 'bcryptjs';
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const prisma = new PrismaClient({ log: ['query'] });

  try {
    const { name, email, password } = req.body;

    // need to validate the input

    const _user = await prisma.user.findFirst({
      where: {
        email
      }
    });

    if (_user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    })

    res.status(201).json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  } finally {
    await prisma.$disconnect();
  }
}