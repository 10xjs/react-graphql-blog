import React from 'react';

interface PageProps {
  rootElementId: string;
  head: React.ReactNode;
  markup: string;
  foot: React.ReactNode;
  htmlAttributes: React.HTMLAttributes<HTMLElement>;
  bodyAttributes: React.HTMLAttributes<HTMLElement>;
}

const Page = ({
  rootElementId,
  head,
  markup,
  foot,
  htmlAttributes,
  bodyAttributes,
}: PageProps): React.ReactElement => (
  <html lang="en" {...htmlAttributes}>
    <head>
      <meta charSet="utf-8" />
      {head}
    </head>
    <body {...bodyAttributes}>
      <div
        id={rootElementId}
        className="root"
        dangerouslySetInnerHTML={{__html: markup}}
      />
      {foot}
    </body>
  </html>
);

export default Page;
