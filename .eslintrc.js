module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'prettier',
    'prettier/vue',
    'plugin:vue/base',
    'plugin:prettier/recommended',
    'plugin:nuxt/recommended',
  ],
  plugins: ['prettier'],
  rules: {
    'vue/valid-v-slot': [
      'error',
      {
        allowModifiers: true,
      },
    ],
    'new-cap': [1],
    'no-console': [0],
  },
  ignorePatterns: ['functions/lib'],
}
