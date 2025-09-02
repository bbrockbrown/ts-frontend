/// <reference types="vite/client" />

// Type for importing svgs (see /src/assets/icons.ts)
declare module "*.svg" {
  import React from "react";
  const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}
