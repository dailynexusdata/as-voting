module.exports = {
  extends: 'airbnb',
  env: {
    browser: true,
  },
  rules: {
    'linebreak-style': ['error', 'windows'],
    'implicit-arrow-linebreak': ['error', 'beside'],
    'arrow-body-style': ['error', 'as-needed'],
    'brace-style': ['error', 'stroustrup'],
    'max-len': ['error', { ignoreComments: true }],
    'operator-linebreak': ['error', 'before', { overrides: { '=': 'after' } }],
    'no-multi-str': 'error',
    'func-names': ['error', 'never'],
  },
};
