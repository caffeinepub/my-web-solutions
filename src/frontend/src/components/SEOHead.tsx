import { useEffect } from "react";

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  url?: string;
}

export function SEOHead({
  title,
  description,
  keywords,
  ogImage = "/assets/image.png",
  ogType = "website",
  url,
}: SEOHeadProps) {
  useEffect(() => {
    // Title
    document.title = title;

    const setMeta = (selector: string, attr: string, value: string) => {
      let el = document.querySelector(selector) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        const parts = selector.match(/\[([^=]+)=["']([^"']+)["']\]/);
        if (parts) el.setAttribute(parts[1], parts[2]);
        document.head.appendChild(el);
      }
      el.setAttribute(attr, value);
      return el;
    };

    // Basic meta
    setMeta('meta[name="description"]', "content", description);
    if (keywords) setMeta('meta[name="keywords"]', "content", keywords);

    // Open Graph
    const resolvedUrl = url || window.location.href;
    const absoluteImage = ogImage.startsWith("http")
      ? ogImage
      : `${window.location.origin}${ogImage}`;

    setMeta('meta[property="og:title"]', "content", title);
    setMeta('meta[property="og:description"]', "content", description);
    setMeta('meta[property="og:type"]', "content", ogType);
    setMeta('meta[property="og:url"]', "content", resolvedUrl);
    setMeta('meta[property="og:image"]', "content", absoluteImage);
    setMeta('meta[property="og:site_name"]', "content", "My Web Solutions");

    // Twitter Card
    setMeta('meta[name="twitter:card"]', "content", "summary_large_image");
    setMeta('meta[name="twitter:title"]', "content", title);
    setMeta('meta[name="twitter:description"]', "content", description);
    setMeta('meta[name="twitter:image"]', "content", absoluteImage);

    // Cleanup: reset to defaults on unmount
    return () => {
      document.title = "My Web Solutions";
    };
  }, [title, description, keywords, ogImage, ogType, url]);

  return null;
}
