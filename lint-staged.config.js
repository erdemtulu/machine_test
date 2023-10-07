module.exports = {
  '*.ts?(x)': (files) => {
    return [`eslint --debug ${files.join(' ')} --fix`.trim(), `prettier --write ${files.join(' ')}`.trim()];
  },
  '*.html?(x)': (files) => {
    return [`prettier --write ${files.join(' ')}`.trim()];
  }
};
