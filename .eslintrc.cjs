"use strict";
/**
 * Local ESLint config for Codacy's ESLint 8 engine.
 * The project itself uses Biome; this file exists so Codacy does not apply
 * outdated React 16 JSX-scope / i18n rules to a Next.js App Router codebase.
 */
module.exports = {
	env: {
		browser: true,
		es2022: true,
		node: true,
	},
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		ecmaVersion: "latest",
		sourceType: "module",
	},
	root: true,
	rules: {
		"compat/compat": "off",
		"i18next/no-literal-string": "off",
		"react/jsx-uses-react": "off",
		"react/react-in-jsx-scope": "off",
	},
	settings: {
		react: {
			version: "detect",
		},
	},
};
