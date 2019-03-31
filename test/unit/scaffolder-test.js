import {assert} from 'chai';
import {scaffold} from '../../src/scaffolder';

suite('scaffolder', () => {
  test('that spectacle dependencies are defined', async () => {
    assert.deepEqual(
      await scaffold(),
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
  });
});
