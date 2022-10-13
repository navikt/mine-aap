import { NextPageContext, GetServerSidePropsResult } from 'next';
import { isMock } from 'lib/utils/environments';
import { getAccessToken } from 'lib/auth/accessToken';
import { verifyIdportenAccessToken } from 'lib/auth/verifyIdPortenAccessToken';

type PageHandler = (context: NextPageContext) => void | Promise<GetServerSidePropsResult<{}>>;

const wonderwallRedirect = {
  redirect: {
    destination: '/oauth2/login?redirect=/aap/mine-aap',
    permanent: false,
  },
};

export function beskyttetSide(handler: PageHandler) {
  return async function withBearerTokenHandler(
    context: NextPageContext
  ): Promise<ReturnType<typeof handler>> {
    if (isMock()) {
      return handler(context);
    }

    const bearerToken = getAccessToken(context);

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
