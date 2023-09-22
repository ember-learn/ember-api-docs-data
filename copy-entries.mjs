import { rmSync } from 'fs';

import fse from 'fs-extra';
import { program } from 'commander';
import { execa } from 'execa';

const { copySync } = fse;

program
  .argument('project')
  .argument('version');

program.parse();


const [project, version] = program.args;


rmSync(`json-docs/${project}/${version}`, { recursive: true, force: true });
rmSync(`rev-index/${project}-${version}.json`);

copySync(`/Users/mansona/temp/old-docs/json-docs/${project}/${version}`, `./json-docs/${project}/${version}`, {recursive: true});
copySync(`/Users/mansona/temp/old-docs/rev-index/${project}-${version}.json`, `./rev-index/${project}-${version}.json`);

await execa('npm', ['run', 'fix:files'], { stdio: 'inherit'});
await execa('npm', ['run', 'test'], { stdio: 'inherit'});