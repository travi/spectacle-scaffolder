import {promises as fs} from 'fs';
import {resolve} from 'path';
import makeDir from 'make-dir';

import {it, expect, describe, vi} from 'vitest';
import {when} from 'vitest-when';
import any from '@travi/any';

import scaffoldPresentation from './scaffolder.js';

vi.mock('fs');
vi.mock('make-dir');

describe('presentation scaffolder', () => {
  it('should define spectacle dependencies', async () => {
    const projectRoot = any.string();
    const pathToCreatedDirectory = any.string();
    when(makeDir).calledWith(`${projectRoot}/src`).thenResolve(pathToCreatedDirectory);

    expect(await scaffoldPresentation({projectRoot})).toEqual({
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
    });
    expect(fs.copyFile).toHaveBeenCalledWith(
      resolve(__dirname, '..', 'templates', 'index.txt'),
      `${pathToCreatedDirectory}/index.js`
    );
    expect(fs.copyFile).toHaveBeenCalledWith(
      resolve(__dirname, '..', 'templates', 'presentation.txt'),
      `${pathToCreatedDirectory}/presentation.js`
    );
  });
});
