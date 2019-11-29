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
      'style-loader',
      'cypress',
      'start-server-and-test'
    ],
    scripts: {
      build: 'webpack --env production',
      'build:dev': 'webpack --env development',
      start: 'serve lib/',
      dev: 'webpack-dev-server',
      'test:smoke': "start-server-and-test 'npm start' http://localhost:5000 cypress:run",
      'cypress:run': 'cypress run',
      'cypress:open': 'cypress open'
    },
    vcsIgnore: {files: [], directories: ['/cypress/fixtures/', '/cypress/videos/', '/cypress/screenshots']},
    eslintConfigs: ['react', 'cypress']
  };
}
