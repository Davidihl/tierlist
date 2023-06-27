import { gql } from '@apollo/client';
import { getClient } from '../../../util/apolloClient';

type Props = {
  params: {
    slug: string;
  };
};

export async function generateMetadata(props: Props) {
  // const { data } = await getClient().query({
  //   query: gql`
  //     query PlayerBySlug($slug: String!) {
  //       playerBySlug(slug: $slug) {
  //         alias
  //       }
  //     }
  //   `,
  //   variables: {
  //     slug: props.params.slug,
  //   },
  // });
  // if (!data) {
  //   return {
  //     title: 'Organisation not found',
  //     description: 'Could not find the organisation you are looking for',
  //   };
  // }
  // return {
  //   title: `Player Profile for ${data.playerBySlug.alias}`,
  //   description: `This is the player profile page for ${data.playerBySlug.alias}. You can look up contact information or the various league of legends accounts he claims to have access to.`,
  // };
}

export default function OrganisationPage(props: Props) {
  return <div>Organisation</div>;
}
