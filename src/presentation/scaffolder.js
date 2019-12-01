import {promises} from 'fs';
import {resolve} from 'path';
import mkdir from '../../third-party-wrappers/make-dir';

export default async function ({projectRoot}) {
  const srcDirectory = await mkdir(`${projectRoot}/src`);

  await promises.copyFile(resolve(__dirname, '..', 'templates', 'index.txt'), `${srcDirectory}/index.js`);

  return {
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
    vcsIgnore: {
      files: [],
      directories: []
    },
    eslintConfigs: ['react']
  };
}
