/**
 * Local ESLint config for Codacy's ESLint 8 engine.
 * The project itself uses Biome; this file exists so Codacy does not apply
 * outdated React 16 JSX-scope / i18n rules to a Next.js App Router codebase.
 */
module.exports = {
	root: true,
	env: {
		browser: true,
		es2022: true,
		node: true,
	},
	parserOptions: {
		ecmaVersion: "latest",
		sourceType: "module",
		ecmaFeatures: {
			jsx: true,
		},
	},
	settings: {
		react: {
			version: "detect",
		},
	},
	rules: {
		"react/react-in-jsx-scope": "off",
		"react/jsx-uses-react": "off",
		"i18next/no-literal-string": "off",
		"compat/compat": "off",
	},
};
