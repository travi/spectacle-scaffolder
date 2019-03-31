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
  });

  teardown(() => sandbox.restore());

  test('that spectacle dependencies are defined', async () => {
    const projectRoot = any.string();
    // const pathToCreatedDirectory = any.string();
    // mkdir.default.withArgs(`${projectRoot}/src`).resolves(pathToCreatedDirectory);
    mkdir.default.resolves();

    assert.deepEqual(
      await scaffold({projectRoot}),
      {
        dependencies: ['spectacle', 'react', 'react-dom', 'prop-types', 'normalize.css'],
        devDependencies: [
          'webpack',
          'webpack-cli',
          'webpack-config-utils',
          'webpack-dev-server',
          'react-hot-loader',
          'redbox-react',
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
    assert.calledWith(mkdir.default, `${projectRoot}/src`);
  });
});
