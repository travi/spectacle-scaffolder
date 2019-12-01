import {assert} from 'chai';
import any from '@travi/any';
import scaffoldPresentation from './scaffolder';

suite('presentation scaffolder', () => {
  test('that spectacle dependencies are defined', async () => {
    const projectRoot = any.string();

    assert.deepEqual(
      await scaffoldPresentation({projectRoot}),
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
        devDependencies: [],
        scripts: {},
        vcsIgnore: {files: [], directories: []},
        eslintConfigs: ['react']
      }
    );
  });
});
