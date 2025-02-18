import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import multer from 'multer';

const upload = multer({
  storage: multer.diskStorage({
    destination: process.env.UPLOADS_PATH,
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    }
  })
})

const apiRoute = nextConnect<NextApiRequest, NextApiResponse>({
  onError(error, req, res) {
    res.status(501).json({ error: `Sorry something Happened! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  }
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