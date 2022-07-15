import { NextApiRequest, NextApiResponse } from 'next';
import { beskyttetApi } from '../../auth/beskyttetApi';

export interface MellomlagretSøknad {
  timestamp: string;
}

const handler = beskyttetApi(async (req: NextApiRequest, res: NextApiResponse) => {
  const mellomlagretSøknad = await getMellomlagretSøknad();
  res.status(200).json(mellomlagretSøknad);
});

export const getMellomlagretSøknad = async () => {
  const mellomlagretSøknad: MellomlagretSøknad = {
    timestamp: new Date().toISOString(),
  };

  return mellomlagretSøknad;
};

export default handler;
