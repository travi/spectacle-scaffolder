import {promises} from 'fs';
import {resolve} from 'path';
import * as cypressScaffolder from '@form8ion/cypress-scaffolder';
import {assert} from 'chai';
import sinon from 'sinon';
import any from '@travi/any';
import * as mkdir from '../../third-party-wrappers/make-dir';
import {scaffold} from '../../src/scaffolder';

suite('scaffolder', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(mkdir, 'default');
    sandbox.stub(promises, 'copyFile');
    sandbox.stub(cypressScaffolder, 'scaffold');
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
    const smokeTestBaseUrl = 'http://localhost:5000';
    mkdir.default
      .withArgs(`${projectRoot}/src`)
      .resolves(pathToCreatedDirectory);
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
          'spectacle',
          'react',
          'react-dom',
          'prop-types',
          'normalize.css',
          'redbox-react',
          'react-hot-loader',
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
          ...cypressDevDependencies
        ],
        scripts: {
          build: 'webpack --env production',
          'build:dev': 'webpack --env development',
          start: 'serve lib/',
          dev: 'webpack-dev-server',
          'test:smoke': `start-server-and-test 'npm start' ${smokeTestBaseUrl} cypress:run`,
          ...cypressScripts
        },
        vcsIgnore: {
          files: cypressFilesToIgnore,
          directories: cypressDirectoriesToIgnore
        },
        eslintConfigs: ['react', ...cypressEslintConfigs]
      }
    );
    assert.calledWith(
      promises.copyFile, resolve(__dirname, '..', '..', 'templates', 'index.txt'),
      `${pathToCreatedDirectory}/index.js`
    );
  });
});
