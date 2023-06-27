import { gql } from '@apollo/client';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { getValidSessionByToken } from '../../../database/sessions';
import { getClient } from '../../../util/apolloClient';

export const dynamic = 'force-dynamic';

type Props = {
  params: {
    slug: string;
  };
};

export async function generateMetadata(props: Props) {
  const { data } = await getClient().query({
    query: gql`
      query getOrganisationBySlug($slug: String!) {
        organisationBySlug(slug: $slug) {
          id
          alias
        }
      }
    `,
    variables: {
      slug: props.params.slug,
    },
  });
  console.log(data);
  if (!data.organisationBySlug) {
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
  const { data } = await getClient().query({
    query: gql`
      query getOrganisationBySlug($slug: String!) {
        organisationBySlug(slug: $slug) {
          id
          alias
          contact
          user {
            id
          }
        }
      }
    `,
    variables: {
      slug: props.params.slug,
    },
  });

  if (!data.organisationBySlug) {
    notFound();
  }

  const allowEdit = session?.userId === Number(data.organisationBySlug.user.id);

  return (
    <main className="p-4">
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
    </main>
  );
}
