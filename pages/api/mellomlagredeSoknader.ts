import { NextApiRequest, NextApiResponse } from 'next';
import { beskyttetApi } from '../../auth/beskyttetApi';
import { MellomlagretSøknad } from '../../types/types';

const handler = beskyttetApi(async (req: NextApiRequest, res: NextApiResponse) => {
  const mellomlagredeSøknader = await getMellomlagredeSøknader();
  res.status(200).json(mellomlagredeSøknader);
});

export const getMellomlagredeSøknader = async () => {
  const mellomlagredeSøknader: MellomlagretSøknad[] = [
    {
      timestamp: new Date().toISOString(),
    },
  ];

  return mellomlagredeSøknader;
};

export default handler;
