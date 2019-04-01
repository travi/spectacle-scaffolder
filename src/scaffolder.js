import mkdir from '../third-party-wrappers/make-dir';

export async function scaffold({projectRoot}) {
  await mkdir(`${projectRoot}/src`);

  return {
    dependencies: [
      'spectacle',
      'react',
      'react-dom',
      'prop-types',
      'normalize.css',
      'redbox-react',
      'react-hot-loader'
    ],
    devDependencies: [
      'webpack',
      'webpack-cli',
      'webpack-config-utils',
      'webpack-dev-server',
      'html-webpack-plugin',
      'babel-loader',
      'mustache-loader',
      'raw-loader',
      'style-loader'
    ],
    scripts: {
      build: 'webpack --env production',
      'build:dev': 'webpack --env development',
      start: 'webpack-dev-server'
    },
    vcsIgnore: {files: [], directories: []}
  };
}
