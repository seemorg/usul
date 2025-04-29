import baseConfig, { restrictEnvAccess } from "./tooling/eslint/base.js";
import nextjsConfig from "./tooling/eslint/nextjs.js";
import reactConfig from "./tooling/eslint/react.js";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [".next/**", "public/pdf-express"],
  },
  ...baseConfig,
  ...reactConfig,
  ...nextjsConfig,
  ...restrictEnvAccess,
];
