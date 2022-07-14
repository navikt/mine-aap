import { NextPageContext, GetServerSidePropsResult } from 'next';
import { isMock } from '../utils/environments';
import { verifyIdportenAccessToken } from './verifyIdPortenAccessToken';

type PageHandler = (context: NextPageContext) => void | Promise<GetServerSidePropsResult<{}>>;

const wonderwallRedirect = {
  redirect: {
    destination: '/oauth2/login?redirect=/aap/innsyn',
    permanent: false,
  },
};

function beskyttetSide(handler: PageHandler) {
  return async function withBearerTokenHandler(
    context: NextPageContext
  ): Promise<ReturnType<typeof handler>> {
    if (isMock()) {
      return handler(context);
    }

    const request = context.req;
    if (request == null) {
      throw new Error('Context is missing request. This should not happen');
    }

    const bearerToken: string | null | undefined = request.headers['authorization'];
    if (!bearerToken) {
      return wonderwallRedirect;
    }

    try {
      await verifyIdportenAccessToken(bearerToken);
    } catch (e) {
      console.log('kunne ikke validere idportentoken i beskyttetSide', e);
      return wonderwallRedirect;
    }
    return handler(context);
  };
}

export const beskyttetSideUtenProps = beskyttetSide(
  async (ctx): Promise<GetServerSidePropsResult<{}>> => {
    return {
      props: {},
    };
  }
);
