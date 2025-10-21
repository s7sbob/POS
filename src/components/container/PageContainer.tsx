// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';

import { Helmet } from 'react-helmet';

type Props = {
  description?: string;
  children: any | any[]
  /**
   * An optional page specific title.  This prop is ignored in favour of a
   * constant application title to ensure that the browser tab always reads
   * "Foodify" regardless of which page is currently active.
   */
  title?: string;
};

const PageContainer = ({ title, description, children }: Props) => (
  <div>
    <Helmet>
      {/* Force a constant page title.  We ignore the provided `title` prop
          so that the tab name never changes across the application. */}
      <title>Foodify</title>
      <meta name="description" content={description} />
    </Helmet>
    {children}
  </div>
);

export default PageContainer;
