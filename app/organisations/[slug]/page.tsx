import { gql } from '@apollo/client';
import { notFound } from 'next/navigation';
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
  // return {
  //   title: `Organisation Profile for ${data.organisationBySlug.alias}`,
  //   description: `This is the organisation profile page for ${data.organisationBySlug.alias}. You can look up contact information here.`,
  // };
}

export default async function OrganisationPage(props: Props) {
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
  console.log(props.params.slug);
  console.log(data);
  return <div>Organisation</div>;
}
