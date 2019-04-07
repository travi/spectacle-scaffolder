import {writeFile} from 'mz/fs';

export default async function ({srcDirectory, configs}) {
  if (configs.eslint) {
    await writeFile(`${srcDirectory}/.eslintrc.yml`, `extends: '${configs.eslint.prefix}/rules/react'`);
  }
}
