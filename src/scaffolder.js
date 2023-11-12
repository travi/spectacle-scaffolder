import {scaffold as scaffoldCypress} from '@form8ion/cypress-scaffolder';

import scaffoldPresentation from './presentation/index.js';

export async function scaffold({projectRoot}) {
  const smokeTestBaseUrl = 'http://localhost:5000';

  const [presentationResults, cypressResults] = await Promise.all([
    scaffoldPresentation({projectRoot}),
    scaffoldCypress({projectRoot, testDirectory: 'test/smoke/', testBaseUrl: smokeTestBaseUrl})
  ]);

  return {
    dependencies: [
      ...presentationResults.dependencies,
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
      ...presentationResults.devDependencies,
      ...cypressResults.devDependencies
    ],
    scripts: {
      build: 'webpack --env production',
      'build:dev': 'webpack --env development',
      prestart: 'run-s build',
      start: 'serve lib/',
      dev: 'webpack-dev-server',
      'test:smoke': `start-server-and-test 'npm start' ${smokeTestBaseUrl} cypress:run`,
      ...presentationResults.scripts,
      ...cypressResults.scripts
    },
    vcsIgnore: {
      files: [...presentationResults.vcsIgnore.files, ...cypressResults.vcsIgnore.files],
      directories: [...presentationResults.vcsIgnore.directories, ...cypressResults.vcsIgnore.directories]
    },
    eslintConfigs: [...presentationResults.eslintConfigs, ...cypressResults.eslintConfigs]
  };
}
