import {promises} from 'fs';
import {resolve} from 'path';
import {scaffold as scaffoldCypress} from '@form8ion/cypress-scaffolder';
import mkdir from '../third-party-wrappers/make-dir';

export async function scaffold({projectRoot}) {
  const srcDirectory = await mkdir(`${projectRoot}/src`);
  const smokeTestBaseUrl = 'http://localhost:5000';

  const [cypressResults] = await Promise.all([
    scaffoldCypress({projectRoot, testDirectory: 'test/smoke/', testBaseUrl: smokeTestBaseUrl}),
    promises.copyFile(resolve(__dirname, '..', 'templates', 'index.txt'), `${srcDirectory}/index.js`)
  ]);

  return {
    dependencies: [
      'spectacle',
      'react',
      'react-dom',
      'prop-types',
      'normalize.css',
      'redbox-react',
      'react-hot-loader',
      ...cypressResults.dependencies
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
      'start-server-and-test',
      ...cypressResults.devDependencies
    ],
    scripts: {
      build: 'webpack --env production',
      'build:dev': 'webpack --env development',
      start: 'serve lib/',
      dev: 'webpack-dev-server',
      'test:smoke': `start-server-and-test 'npm start' ${smokeTestBaseUrl} cypress:run`,
      ...cypressResults.scripts
    },
    vcsIgnore: {files: cypressResults.vcsIgnore.files, directories: cypressResults.vcsIgnore.directories},
    eslintConfigs: ['react', ...cypressResults.eslintConfigs]
  };
}
