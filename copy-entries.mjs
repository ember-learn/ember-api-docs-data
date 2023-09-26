import { rmSync, readdirSync } from 'fs';

import fse from 'fs-extra';
import { program } from 'commander';
import { execa } from 'execa';
import semver from 'semver';
import cmp from 'semver-compare';

const { copySync } = fse;

program
  .argument('project')
  .argument('[version]')
  .option('-m, --min-version [version]');

program.parse();

const [project, version] = program.args;

const { minVersion } = program.opts();

const oldDocsPath = '/Users/mansona/temp/old-docs'


if (version) {
  // only apply for the specified version
  copyEntries(project, version);
} else {
  // do all versions
  const fullProjectVersions = readdirSync(
    `${oldDocsPath}/json-docs/${project}`
  ).filter((v) => v.match(/\d+\.\d+\.\d+/));
  
  const projectVersions = fullProjectVersions.map((v) => {
    let [, major, minor] = v.match(/(\d+)\.(\d+)\.\d+/);
    return `${major}.${minor}`;
  });
  
  const uniqueProjectVersions = [...new Set(projectVersions)];
  const highestPatchVersions = uniqueProjectVersions.map((uniqVersion) => {
    const sortedPatchVersions = fullProjectVersions
      .filter((projectVersion) => {
        return semver.satisfies(projectVersion, uniqVersion);
      })
      .sort(cmp);
  
    return sortedPatchVersions[sortedPatchVersions.length - 1];
  })
  .sort(cmp)
  .filter((version) => {
    if (minVersion) {
      return semver.gte(version, minVersion);
    } else {
      return true;
    }
  });

  for (let version of highestPatchVersions) {
    await copyEntries(project, version)
  }
}

async function copyEntries(project, version) {
  rmSync(`json-docs/${project}/${version}`, { recursive: true, force: true });
  try {
    rmSync(`rev-index/${project}-${version}.json`);
  } catch {
    // ignore
  }
  
  copySync(`${oldDocsPath}/json-docs/${project}/${version}`, `./json-docs/${project}/${version}`, {recursive: true});
  copySync(`${oldDocsPath}/rev-index/${project}-${version}.json`, `./rev-index/${project}-${version}.json`);
  
  await execa('npm', ['run', 'fix:files'], { stdio: 'inherit'});
  await execa('npm', ['run', 'test'], { stdio: 'inherit'});
}
