import { NextApiRequest, NextApiResponse } from 'next';
import { beskyttetApi } from '../../auth/beskyttetApi';
import { Dokument } from '../../types/types';

const handler = beskyttetApi(async (req: NextApiRequest, res: NextApiResponse) => {
  const dokumenter = await getDocuments();

  res.status(200).json(dokumenter);
});

export const getDocuments = async () => {
  const dokumenter: Dokument[] = [
    {
      tittel: 'Ettersendt dokumentasjon om studiested',
      timestamp: new Date().toISOString(),
      url: '#',
      type: 'pdf',
    },
    {
      tittel: 'Søknad om arbeidsavklaringspenger',
      timestamp: new Date().toISOString(),
      url: '#',
      type: 'pdf',
    },
  ];

  return dokumenter;
};

export default handler;
