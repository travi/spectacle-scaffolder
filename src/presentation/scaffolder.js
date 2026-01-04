import {promises as fs} from 'fs';
import {resolve} from 'path';
import makeDir from 'make-dir';

export default async function scaffold({projectRoot}) {
  const srcDirectory = await makeDir(`${projectRoot}/src`);

  await Promise.all([
    fs.copyFile(resolve(__dirname, '..', 'templates', 'index.txt'), `${srcDirectory}/index.js`),
    fs.copyFile(resolve(__dirname, '..', 'templates', 'presentation.txt'), `${srcDirectory}/presentation.js`)
  ]);

  return {
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
  };
}
