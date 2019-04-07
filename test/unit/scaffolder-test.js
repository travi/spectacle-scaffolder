import {assert} from 'chai';
import sinon from 'sinon';
import any from '@travi/any';
import * as mkdir from '../../third-party-wrappers/make-dir';
import * as lintScaffolder from '../../src/lint';
import {scaffold} from '../../src/scaffolder';

suite('scaffolder', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(mkdir, 'default');
    sandbox.stub(lintScaffolder, 'default');
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
      }
    );
    assert.calledWith(lintScaffolder.default, {srcDirectory: pathToCreatedDirectory, configs});
  });
});
