export const SchemaWebPage = props => {
  console.log(props)
  const WebPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Byron Wades Website Developemnt",
    "description": "Web design and development"
  };
  return JSON.stringify(WebPage);
}