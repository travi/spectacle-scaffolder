import {scaffold as scaffoldCypress} from '@form8ion/cypress-scaffolder';

import {describe, it, vi, expect} from 'vitest';
import {when} from 'vitest-when';
import any from '@travi/any';

import scaffoldPresentation from './presentation/index.js';
import {scaffold} from './scaffolder.js';

vi.mock('@form8ion/cypress-scaffolder');
vi.mock('./presentation/index.js');

describe('scaffolder', () => {
  it('should generate the details needed for spectacle', async () => {
    const projectRoot = any.string();
    const configs = any.simpleObject();
    const cypressDevDependencies = any.listOf(any.string);
    const cypressDependencies = any.listOf(any.string);
    const cypressFilesToIgnore = any.listOf(any.string);
    const cypressDirectoriesToIgnore = any.listOf(any.string);
    const cypressEslintConfigs = any.listOf(any.string);
    const cypressScripts = any.simpleObject();
    const presentationDevDependencies = any.listOf(any.string);
    const presentationDependencies = any.listOf(any.string);
    const presentationFilesToIgnore = any.listOf(any.string);
    const presentationDirectoriesToIgnore = any.listOf(any.string);
    const presentationEslintConfigs = any.listOf(any.string);
    const presentationScripts = any.simpleObject();
    const smokeTestBaseUrl = 'http://localhost:5000';
    when(scaffoldPresentation)
      .calledWith({projectRoot})
      .thenResolve({
        dependencies: presentationDependencies,
        devDependencies: presentationDevDependencies,
        vcsIgnore: {
          directories: presentationDirectoriesToIgnore,
          files: presentationFilesToIgnore
        },
        eslintConfigs: presentationEslintConfigs,
        scripts: presentationScripts
      });
    when(scaffoldCypress)
      .calledWith({
        projectRoot,
        testDirectory: 'test/smoke/',
        testBaseUrl: smokeTestBaseUrl
      })
      .thenResolve({
        dependencies: cypressDependencies,
        devDependencies: cypressDevDependencies,
        vcsIgnore: {
          directories: cypressDirectoriesToIgnore,
          files: cypressFilesToIgnore
        },
        eslintConfigs: cypressEslintConfigs,
        scripts: cypressScripts
      });

    expect(await scaffold({projectRoot, configs})).toEqual({
      dependencies: [
        ...presentationDependencies,
        ...cypressDependencies
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
        ...presentationDevDependencies,
        ...cypressDevDependencies
      ],
      scripts: {
        build: 'webpack --env production',
        'build:dev': 'webpack --env development',
        prestart: 'run-s build',
        start: 'serve lib/',
        dev: 'webpack-dev-server',
        'test:smoke': `start-server-and-test 'npm start' ${smokeTestBaseUrl} cypress:run`,
        ...presentationScripts,
        ...cypressScripts
      },
      vcsIgnore: {
        files: [...presentationFilesToIgnore, ...cypressFilesToIgnore],
        directories: [...presentationDirectoriesToIgnore, ...cypressDirectoriesToIgnore]
      },
      eslintConfigs: [...presentationEslintConfigs, ...cypressEslintConfigs]
    });
  });
});
