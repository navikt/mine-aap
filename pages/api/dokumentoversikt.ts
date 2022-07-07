import { NextApiRequest, NextApiResponse } from 'next';
import { beskyttetApi } from '../../auth/beskyttetApi';

export interface Dokument {
  tittel: string;
  timestamp: string;
  url?: string;
}

const handler = beskyttetApi(async (req: NextApiRequest, res: NextApiResponse) => {
  const dokumenter: Dokument[] = [
    {
      tittel: 'Ettersendt dokumentasjon om studiested',
      timestamp: new Date().toISOString(),
    },
    {
      tittel: 'Søknad om arbeidsavklaringspenger',
      timestamp: new Date().toISOString(),
    },
  ];

  res.status(200).json(dokumenter);
});

export default handler;
