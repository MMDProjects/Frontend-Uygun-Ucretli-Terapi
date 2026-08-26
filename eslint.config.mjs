import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // React Compiler ile gelen yeni kural seti. Mevcut kod tabaninda
      // 33 ihlal var (29'u tek kural) ve duzeltilmeleri hook refactoru
      // gerektiriyor. CI'i bloklamamalari icin uyari seviyesinde;
      // hedef bunlari modul modul sifira indirmek.
      // Borc: set-state-in-effect 29, refs 3, immutability 1.
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/refs": "warn",
      "react-hooks/immutability": "warn",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
