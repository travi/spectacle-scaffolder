import {promises} from 'fs';
import {resolve} from 'path';

import {assert} from 'chai';
import any from '@travi/any';
import sinon from 'sinon';

import * as mkdir from '../../third-party-wrappers/make-dir.js';
import scaffoldPresentation from './scaffolder.js';

suite('presentation scaffolder', () => {
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
    mkdir.default
      .withArgs(`${projectRoot}/src`)
      .resolves(pathToCreatedDirectory);

    assert.deepEqual(
      await scaffoldPresentation({projectRoot}),
      {
        dependencies: [
          'spectacle@5',
          'react',
          'react-dom',
          'prop-types',
          'normalize.css',
          'redbox-react',
          'react-hot-loader'
        ],
        devDependencies: [],
        scripts: {},
        vcsIgnore: {
          files: [],
          directories: []
        },
        eslintConfigs: ['react']
      }
    );
    assert.calledWith(
      promises.copyFile,
      resolve(__dirname, '..', 'templates', 'index.txt'),
      `${pathToCreatedDirectory}/index.js`
    );
    assert.calledWith(
      promises.copyFile,
      resolve(__dirname, '..', 'templates', 'presentation.txt'),
      `${pathToCreatedDirectory}/presentation.js`
    );
  });
});
