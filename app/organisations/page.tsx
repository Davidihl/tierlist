import { gql } from '@apollo/client';
import Organisation from '../../components/Organisation';
import { getClient } from '../../util/apolloClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Organisations',
  description: 'Explore organisations registered in the ESVÖ playerdatabase',
};

export type OrganisationQuery = {
  id: number;
  alias: string;
  contact: string;
  slug: string;
  associations: [id: string];
};

export default async function OrganisationsPage() {
  const { data } = await getClient().query({
    query: gql`
      query getAllOrganisations {
        organisations {
          id
          alias
          contact
          slug
          associations {
            id
          }
        }
      }
    `,
  });

  const organisations: OrganisationQuery[] = data.organisations;
  return (
    <main className="p-4 max-w-lg">
      <div className="w-full max-w-lg">
        <h1 className="font-medium text-xl">Organisations</h1>
        {organisations.map((organisation) => {
          return (
            <div
              key={`player-${organisation.id}`}
              className="flex gap-2 justify-between max-w-lg border-b p-2 first:border-t"
            >
              <Organisation organisation={organisation} />
            </div>
          );
        })}
      </div>
    </main>
  );
}
