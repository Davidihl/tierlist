import { gql } from '@apollo/client';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { getOrganisationBySlug } from '../../../database/organisations';
import { getValidSessionByToken } from '../../../database/sessions';
import { getClient } from '../../../util/apolloClient';
import { PlayerQuery } from '../../players/page';
import Player from '../../players/Player';
import AssociatedPlayer from './AssociatedPlayer';
import AssociationRequestForm from './AssociationRequestForm';
import EditProfile from './EditProfile';
import EndAssociation from './EndAssociation';
import PendingQueries from './PendingQueries';

export const dynamic = 'force-dynamic';

type Props = {
  params: {
    slug: string;
  };
};

type Association = {
  id: number;
  player: PlayerQuery;
};

export async function generateMetadata(props: Props) {
  const { data } = await getClient().query({
    query: gql`
      query getOrganisationBySlug($slug: String!) {
        organisationBySlug(slug: $slug) {
          alias
        }
      }
    `,
    variables: {
      slug: props.params.slug,
    },
  });

  if (!data?.organisationBySlug) {
    return {
      title: 'Organisation not found',
      description: 'Could not find the organisation you are looking for',
    };
  }
  return {
    title: `Organisation Profile for ${data.organisationBySlug.alias}`,
    description: `This is the organisation profile page for ${data.organisationBySlug.alias}. You can look up contact information here.`,
  };
}

export default async function OrganisationPage(props: Props) {
  const sessionTokenCookie = cookies().get('sessionToken');
  const session =
    sessionTokenCookie &&
    (await getValidSessionByToken(sessionTokenCookie.value));

  const { data, loading } = await getClient().query({
    query: gql`
      query getOrganisationBySlug($slug: String!) {
        organisationBySlug(slug: $slug) {
          id
          alias
          contact
          slug
          user {
            id
            username
          }
          associations {
            id
            player {
              alias
              slug
              mainAccount {
                id
                summoner
                tier
                rank
                leaguePoints
                wins
                losses
                lastUpdate
              }
            }
            playerRequest
            organisation {
              id
            }
          }
        }
      }
    `,
    variables: {
      slug: props.params.slug,
    },
  });

  if (loading) return <button className="btn loading">loading</button>;

  if (!data.organisationBySlug) {
    notFound();
  }

  const allowEdit =
    session?.userId === Number(data.organisationBySlug?.user.id);
  const associations: Association[] | undefined =
    data.organisationBySlug?.associations;

  return (
    <main className="flex flex-col items-center sm:p-4 gap-4">
      <div className="shadow-xl w-full max-w-4xl bg-base-100 border-primary sm:border-t-4 relative">
        {allowEdit && (
          <EditProfile
            organisation={data.organisationBySlug}
            userId={session.userId}
          />
        )}
        <div className="card-body">
          <div className="flex gap-4 items-center">
            <div>
              <h1 className="font-medium text-xl">
                {data.organisationBySlug.alias}
              </h1>
              {data.organisationBySlug.contact ? (
                <p>Contact: {data.organisationBySlug.contact}</p>
              ) : (
                ''
              )}
            </div>
          </div>
          <h2 className="font-medium text-lg mb-2">
            Players associated with {data.organisationBySlug.alias}
          </h2>
          <div className="table border-collapse table-auto w-full">
            <div className="hidden sm:table-header-group">
              <div className="table-row text-xs pb-4">
                <div className="table-cell">Alias</div>
                <div className="table-cell text-right">Division</div>
                <div className="table-cell text-right">LP</div>
                <div className="table-cell text-right">Winrate</div>
                <div className="table-cell text-right">Games</div>
              </div>
            </div>
            {associations && associations.length > 0 ? (
              associations.map((association) => {
                return (
                  <div
                    key={`player-${association.player.alias}`}
                    className="table-row w-full border-b"
                  >
                    <AssociatedPlayer player={association.player} />
                    {allowEdit ? (
                      <div className="table-cell align-middle text-right">
                        <EndAssociation id={association.id} />
                      </div>
                    ) : (
                      ''
                    )}
                  </div>
                );
              })
            ) : (
              <p className="py-4">No players associated yet</p>
            )}
            {allowEdit && (
              <PendingQueries
                organisationId={Number(data.organisationBySlug.id)}
              />
            )}
          </div>
        </div>
      </div>
      {allowEdit && (
        <AssociationRequestForm isPlayer={false} userId={session.userId} />
      )}
    </main>
  );
}
