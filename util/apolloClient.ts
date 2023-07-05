import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { registerApolloClient } from '@apollo/experimental-nextjs-app-support/rsc';
import { headers } from 'next/headers';

export const { getClient } = registerApolloClient(() => {
  // Workaround to avoid using 'force-dynamic'
  // headers();

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/graphql`,
      credentials: 'same-origin',
    }),
  });
});
