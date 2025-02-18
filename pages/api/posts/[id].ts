import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'lib/prisma';

// GET, PATCH, DELETE /api/post/:id
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, query, body } = req;
  const id = Number(query.id as string);

  switch (method) {
    case 'GET':
      const post = await prisma.post.findUnique({
        where: { id },
      });

      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }

      res.status(200).json(post);
      break;

    case 'PATCH':
      const { title, content, published } = body;

      const data = {
        ...(title && { title }),
        ...(content && { content }),
        ...(typeof published === 'boolean' && { published }),
      };

      try {
        const post = await prisma.post.update({
          where: { id },
          data,
        });
  
        return res.status(200).json(post);
      } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
      }
      break;

    case 'DELETE':
      try {
        const post = await prisma.post.delete({
          where: { id },
        });

        res.status(204).json({ post });
      } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
      }
      break;
  
    default:
      res.setHeader('Allow', ['GET', 'PUT']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

export default handler;