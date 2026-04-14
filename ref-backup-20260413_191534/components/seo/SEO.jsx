import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function SEO({ title, description, keywords, image, url }) {
  const siteTitle = 'Tham AI Platform';
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const metaDesc = description || 'AI-powered professional matching with Moodle integration. Find top service providers.';
  const metaKeywords = keywords || 'AI matching, professional network, Moodle, service marketplace';
  const metaImage = image || '/social-preview.jpg';
  const metaUrl = url || 'https://thamplatform.com';

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDesc} />
      <meta name="keywords" content={metaKeywords} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:url" content={metaUrl} />
      <meta name="twitter:card" content="summary_large_image" />
      <link rel="canonical" href={metaUrl} />
    </Helmet>
  );
}
