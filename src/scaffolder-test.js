import {promises} from 'fs';
import {resolve} from 'path';
import * as cypressScaffolder from '@form8ion/cypress-scaffolder';
import {assert} from 'chai';
import sinon from 'sinon';
import any from '@travi/any';
import * as mkdir from '../third-party-wrappers/make-dir';
import * as presentationScaffolder from './presentation/scaffolder';
import {scaffold} from './scaffolder';

suite('scaffolder', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(mkdir, 'default');
    sandbox.stub(promises, 'copyFile');
    sandbox.stub(cypressScaffolder, 'scaffold');
    sandbox.stub(presentationScaffolder, 'default');
  });

  teardown(() => sandbox.restore());

  test('that spectacle dependencies are defined', async () => {
    const projectRoot = any.string();
    const pathToCreatedDirectory = any.string();
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
    mkdir.default
      .withArgs(`${projectRoot}/src`)
      .resolves(pathToCreatedDirectory);
    presentationScaffolder.default.resolves({
      dependencies: presentationDependencies,
      devDependencies: presentationDevDependencies,
      vcsIgnore: {
        directories: presentationDirectoriesToIgnore,
        files: presentationFilesToIgnore
      },
      eslintConfigs: presentationEslintConfigs,
      scripts: presentationScripts
    });
    cypressScaffolder.scaffold
      .withArgs({projectRoot, testDirectory: 'test/smoke/', testBaseUrl: smokeTestBaseUrl})
      .resolves({
        dependencies: cypressDependencies,
        devDependencies: cypressDevDependencies,
        vcsIgnore: {
          directories: cypressDirectoriesToIgnore,
          files: cypressFilesToIgnore
        },
        eslintConfigs: cypressEslintConfigs,
        scripts: cypressScripts
      });

    assert.deepEqual(
      await scaffold({
        projectRoot,
        configs
      }),
      {
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
      }
    );
    assert.calledWith(
      promises.copyFile, resolve(__dirname, '..', 'templates', 'index.txt'),
      `${pathToCreatedDirectory}/index.js`
    );
  });
});
