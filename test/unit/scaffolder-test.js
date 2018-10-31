import {assert} from 'chai';
import {scaffold} from '../../src/scaffolder';

suite('scaffolder', () => {
  test('that spectacle dependencies are defined', async () => {
    assert.deepEqual(await scaffold().dependencies, ['spectacle']);
  });
});
