import { NextApiRequest, NextApiResponse } from 'next';
import { getAccessTokenFromRequest } from '../../../auth/accessToken';
import { beskyttetApi } from '../../../auth/beskyttetApi';
import { Vedleggskrav } from '../../../types/types';

const handler = beskyttetApi(async (req: NextApiRequest, res: NextApiResponse) => {
  const accessToken = getAccessTokenFromRequest(req);
  const vedleggskrav = await getVedleggskrav(accessToken);
  res.status(200).json(vedleggskrav);
});

export const getVedleggskrav = async (accessToken?: string) => {
  const vedleggskrav: Vedleggskrav[] = [
    {
      dokumentasjonstype: 'Dokumentasjon om studiested',
      beskrivelse: 'Lorem ipsum dolor sit amet',
    },
  ];
  return vedleggskrav;
};

export default handler;
