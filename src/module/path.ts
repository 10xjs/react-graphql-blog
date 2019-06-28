import {generatePath} from 'react-router';

interface BlogPost {
  __typename: 'BlogPost';
  handle: string;
}

interface Author {
  __typename: 'Author';
  handle: string;
}

type Resource = Author | BlogPost;

export const paths: Record<Resource['__typename'], string> = {
  BlogPost: '/post/:handle',
  Author: '/person/:handle',
};

export function pathFor(resource: Resource) {
  return generatePath(paths[resource.__typename], {handle: resource.handle});
}
