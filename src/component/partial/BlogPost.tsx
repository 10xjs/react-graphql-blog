import React from 'react';
import gql from 'graphql-tag';
import {useDateTimeFormat} from '/util/intlHooks';
import ReactMarkdown from 'react-markdown';

import {Highlight} from '/component/base/Highlight';

import {BlogPost_BlogPost} from './__generated__/BlogPost_BlogPost';

export const BlogPostFragments = {
  BlogPost: gql`
    fragment BlogPost_BlogPost on BlogPost {
      title
      createdAt
      slug
      content
    }
  `,
};

interface Props {
  blogPost: BlogPost_BlogPost;
}

interface HeadingProps {
  level: number;
  children: React.ReactElement[];
}

function elementText(elements: React.ReactElement[]): string {
  return elements.reduce((acc, element) => {
    if (Array.isArray(element.props.children)) {
      return acc + elementText(element.props.children);
    }

    return acc + (element.props.value || '');
  }, '');
}

const Heading = ({level, children}: HeadingProps) => {
  const H = `h${level}` as 'h1';

  const id = elementText(children)
    .replace(/(^\W+|\W+$)/g, '')
    .replace(/\W+/g, '-')
    .toLowerCase();

  return <H id={id}>{children}</H>;
};

export const BlogPost = ({blogPost}: Props) => {
  return (
    <article itemScope itemType="http://schema.org/BlogPosting">
      <time dateTime={blogPost.createdAt}>
        {useDateTimeFormat(blogPost.createdAt, {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })}
      </time>
      <h2>{blogPost.title}</h2>
      <ReactMarkdown
        source={blogPost.content}
        renderers={{code: Highlight, heading: Heading}}
        skipHtml
      />
    </article>
  );
};
