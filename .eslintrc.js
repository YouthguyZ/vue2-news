module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: '@babel/eslint-parser'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    // 配置规则eslint 函数前括号不空行 修改规则
    'space-before-function-paren': ['error', 'never'],
    // 关掉命名报错
    'vue/multi-word-component-names': 'off'
  }
}
