import { NextApiRequest, NextApiResponse } from 'next';
import { getAccessTokenFromRequest } from '../../auth/accessToken';
import { beskyttetApi } from '../../auth/beskyttetApi';
import { Søknad } from '../../types/types';

const handler = beskyttetApi(async (req: NextApiRequest, res: NextApiResponse) => {
  const accessToken = getAccessTokenFromRequest(req);
  const søknader = await getSøknader(accessToken);
  res.status(200).json(søknader);
});

export const getSøknader = async (accessToken?: string) => {
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
          tittel: 'Ettersendt dokumentasjon om studiested',
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
