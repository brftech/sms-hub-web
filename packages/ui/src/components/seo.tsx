import React, { useEffect } from "react";

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
  title = "SMS Hub - Compliant Texting for Business",
  description = "Professional SMS platform for businesses. Compliant texting, customer engagement, and growth tools.",
  keywords = "SMS, texting, business communication, customer engagement",
  image = "/og-image.jpg",
  url = "",
  type = "website",
  siteName = "SMS Hub"
}) => {
  const fullTitle = title === "SMS Hub - Compliant Texting for Business" 
    ? title 
    : `${title} | SMS Hub`;

  useEffect(() => {
    // Update document title
    document.title = fullTitle;

    // Update meta description
    const updateMetaTag = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = name;
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Update property meta tags
    const updatePropertyMetaTag = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Basic Meta Tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    
    // Open Graph Meta Tags
    updatePropertyMetaTag('og:title', fullTitle);
    updatePropertyMetaTag('og:description', description);
    updatePropertyMetaTag('og:image', image);
    updatePropertyMetaTag('og:url', url);
    updatePropertyMetaTag('og:type', type);
    updatePropertyMetaTag('og:site_name', siteName);
    
    // Twitter Meta Tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', fullTitle);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', image);
    
    // Additional Meta Tags
    updateMetaTag('robots', 'index, follow');
    
    // Update canonical link
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = url;
  }, [fullTitle, description, keywords, image, url, type, siteName]);

  return null; // This component doesn't render anything
};

export default SEO;
