export const SchemaWebPage = props => {
  console.log(props)
  const WebPage = {
    "@context": "https://schema.org/",
    "@type": "WebSite",
    "name": "Byron Wades Web Development",
    "url": "https://byronwade.com"
  };
  return JSON.stringify(WebPage);
}