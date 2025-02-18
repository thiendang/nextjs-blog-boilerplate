import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import multer from 'multer';
import prisma from 'lib/prisma';
import { formatDate } from '@/utils/index';
import { getSession } from 'next-auth/react';

const upload = multer({
  storage: multer.diskStorage({
    destination: process.env.UPLOADS_PATH,
    filename: async (req, file, cb) => {
      const session = await getSession({ req });

      if (!session) {
        cb(new Error('Unauthorized'), null);
      }

      const fileName = `${formatDate()}_${file.originalname}`;
      const _user = await prisma.user.update({
        where: { email: session.user.email },
        data: {
          image: fileName,
        },
      });
      cb(null, fileName);
    },
  }),
});

const apiRoute = nextConnect<NextApiRequest, NextApiResponse>({
  onError(error, req, res) {
    res.status(501).json({ error: `Sorry something Happened! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(upload.array('avatar'));

apiRoute.post((req, res) => {
  res.status(200).json({ data: 'success' });
});

export const config = {
  api: {
    bodyParser: false,
  },
};
