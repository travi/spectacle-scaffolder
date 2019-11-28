import {promises} from 'fs';
import {resolve} from 'path';
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
  });

  teardown(() => sandbox.restore());

  test('that spectacle dependencies are defined', async () => {
    const projectRoot = any.string();
    const pathToCreatedDirectory = any.string();
    const configs = any.simpleObject();
    mkdir.default.withArgs(`${projectRoot}/src`).resolves(pathToCreatedDirectory);

    assert.deepEqual(
      await scaffold({projectRoot, configs}),
      {
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
      }
    );
    assert.calledWith(
      promises.copyFile, resolve(__dirname, '..', '..', 'templates', 'index.txt'),
      `${pathToCreatedDirectory}/index.js`
    );
  });
});
