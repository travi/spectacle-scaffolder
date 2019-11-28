import {promises} from 'fs';
import {resolve} from 'path';
import mkdir from '../third-party-wrappers/make-dir';

export async function scaffold({projectRoot}) {
  const srcDirectory = await mkdir(`${projectRoot}/src`);

  await promises.copyFile(resolve(__dirname, '..', 'templates', 'index.txt'), `${srcDirectory}/index.js`);

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
      'serve',
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
      start: 'serve lib/',
      dev: 'webpack-dev-server'
    },
    vcsIgnore: {files: [], directories: []},
    eslintConfigs: ['react']
  };
}
