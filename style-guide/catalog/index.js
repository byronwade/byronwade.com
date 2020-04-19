import React from "react";
import ReactDOM from "react-dom";
import { Catalog, pageLoader } from "catalog";

const pages = [
  {
    title: "Layout",
    pages: [
        {
        path: "/",
        title: "Overview",
        content: pageLoader(() => import("./WELCOME.md")),
      },
      {
        path: "/grid",
        title: "Grid",
        content: pageLoader(() => import("./WELCOME.md")),
      },
      {
        path: "/utilities-for-layout",
        title: "Utilities For Layout",
        content: pageLoader(() => import("./WELCOME.md")),
      }
    ]
  },
  {
    title: "Content",
    pages: [{
      path: "/content",
      title: "Content",
      content: pageLoader(() => import("./WELCOME.md")),
    }]
  },
  {
    title: "Components",
    pages: [{
      path: "/components",
      title: "Components",
      content: pageLoader(() => import("./WELCOME.md")),
    }]
  }
];

ReactDOM.render(
  <Catalog title="Catalog" pages={pages} />,
  document.getElementById("catalog")
);
