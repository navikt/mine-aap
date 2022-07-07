import { NextApiRequest, NextApiResponse } from 'next';
import { beskyttetApi } from '../../auth/beskyttetApi';

const handler = beskyttetApi(async (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json({ name: 'John Doe' });
});

export default handler;
