import { Person } from "schema-dts";
import { JsonLd } from "react-schemaorg";

export function GraceHopper() {
  return <JsonLd<Person>
    item={{
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Grace Hopper",
      alternateName: "Grace Brewster Murray Hopper",
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: ["Yale University", "Vassar College"]
      },
      knowsAbout: ["Compilers", "Computer Science"]
    }}/>;
}