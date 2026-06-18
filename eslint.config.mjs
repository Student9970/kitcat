import next from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

/** Flat ESLint config using the native flat configs from eslint-config-next 16. */
const eslintConfig = [
  ...next,
  ...nextTs,
  {
    ignores: ["out/**", ".next/**", "node_modules/**", "public/**", "scripts/**"],
  },
];

export default eslintConfig;
