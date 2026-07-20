require('@rushstack/eslint-patch/modern-module-resolution');

/** @type {import('eslint').Linter.Config} */
module.exports = {
    root: true,
    extends: [
        'plugin:@kocdigital/loose',
    ],
    settings: {
        'import/resolver': {
            typescript: {
                project: __dirname,
            },
        },
    },
    parserOptions: {
        parser: {
            ts: '@typescript-eslint/parser',
            '<template>': 'espree',
        },
    },
    rules: {
        'function-paren-newline': ['error', 'consistent'],
        'import/no-named-as-default-member': 'off',
        'import/namespace': 'off',
    },
};
