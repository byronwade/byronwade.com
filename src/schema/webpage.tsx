import { WebPage } from "schema-dts";
import { JsonLd } from "react-schemaorg";

export function GraceHopper(props) {
  console.log(props)
  return <JsonLd<WebPage>
    item={{
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Byron Wades Website Developemnt",
      description: "Web design and development"
    }}/>;
}