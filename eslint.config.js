import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: [".next/"],
  },
  ...compat.extends("next/core-web-vitals"),
  {
    rules: {
      // Add or override rules here if needed, e.g., for stricter checks
      "@next/next/no-html-link-for-pages": "off", // Example: Disable if you have custom routing
    },
  },
];

export default eslintConfig; 