import { NextApiRequest, NextApiResponse } from 'next';
import { beskyttetApi } from '../../auth/beskyttetApi';

export interface Søknad {
  timestamp: string;
  applicationPdf: {
    url: string;
    timestamp: string;
  };
  documents: Array<{
    url: string;
    title: string;
    timestamp: string;
    type: string;
  }>;
  missingDocuments: Array<'FOSTERFORELDER' | 'STUDIESTED'>;
}

const handler = beskyttetApi(async (req: NextApiRequest, res: NextApiResponse) => {
  const søknader = await getSøknader();
  res.status(200).json(søknader);
});

export const getSøknader = async () => {
  const søknader: Søknad[] = [
    {
      timestamp: new Date().toISOString(),
      applicationPdf: {
        url: '#',
        timestamp: new Date().toISOString(),
      },
      documents: [
        {
          url: '#',
          title: 'Ettersendt dokumentasjon om studiested',
          timestamp: new Date().toISOString(),
          type: 'pdf',
        },
      ],
      missingDocuments: ['FOSTERFORELDER'],
    },
  ];

  return søknader;
};

export default handler;
