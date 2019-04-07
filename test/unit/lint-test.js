import fs from 'mz/fs';
import sinon from 'sinon';
import {assert} from 'chai';
import any from '@travi/any';
import scaffoldLint from '../../src/lint';

suite('lint scaffolder', () => {
  let sandbox;
  const srcDirectory = any.string();

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(fs, 'writeFile');
  });

  teardown(() => sandbox.restore());

  test('that eslint is configured for linting react code', async () => {
    const eslintConfigPrefix = any.string();
    const configs = {...any.simpleObject(), eslint: {prefix: eslintConfigPrefix}};

    await scaffoldLint({srcDirectory, configs});

    assert.calledWith(fs.writeFile, `${srcDirectory}/.eslintrc.yml`, `extends: '${eslintConfigPrefix}/rules/react'`);
  });

  test('that eslint is not configured if a config is not provided', async () => {
    const configs = {...any.simpleObject()};

    await scaffoldLint({srcDirectory, configs});

    assert.notCalled(fs.writeFile);
  });
});
