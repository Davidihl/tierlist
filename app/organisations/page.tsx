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
  const { data, loading } = await getClient().query({
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

  if (loading) return <button className="btn loading">loading</button>;

  const organisations: OrganisationQuery[] = data.organisations;
  return (
    <main className="flex flex-col items-center sm:p-4 gap-4">
      <div className="shadow-xl w-full max-w-4xl bg-base-100 border-primary sm:border-t-4">
        <div className="card-body">
          <h1 className="font-medium text-xl">Organisations</h1>
          {organisations.map((organisation) => {
            return (
              <div
                key={`player-${organisation.id}`}
                className="flex gap-2 justify-between border-b p-2 first:border-t"
              >
                <Organisation organisation={organisation} />
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
