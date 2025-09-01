import React from "react";
import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
  siteName?: string;
}

const SEO: React.FC<SEOProps> = ({
  title = "SMS Hub - Compliant Texting for Cigar Retailers",
  description = "Professional SMS platform for cigar retailers. Compliant texting, customer engagement, and business growth tools.",
  keywords = "SMS, texting, cigar retailers, business communication, customer engagement",
  image = "/og-image.jpg",
  url = "",
  type = "website",
  siteName = "SMS Hub"
}) => {
  const fullTitle = title === "SMS Hub - Compliant Texting for Cigar Retailers" 
    ? title 
    : `${title} | SMS Hub`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      
      {/* Twitter Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={url} />
    </Helmet>
  );
};

export default SEO;
