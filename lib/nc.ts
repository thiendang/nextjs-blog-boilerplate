export { default } from 'next-connect';

export const ncOptions = {
  onError(error, req, res) {
    res.status(501).json({ error: `Error: ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' not allowed` });
  },
};
