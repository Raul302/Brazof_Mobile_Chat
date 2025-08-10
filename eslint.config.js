// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');

module.exports = defineConfig([
	expoConfig,
	eslintPluginPrettierRecommended,
	{
		ignores: ['dist/*'],
		rules: {
			'func-style': [
				'error',
				'declaration',
				{ allowArrowFunctions: false },
			],
			'prettier/prettier': [
				'error',
				{
					useTabs: true,
					singleQuote: true,
					tabWidth: 4,
				},
			],
		},
	},
]);
