const { readdirSync } = require('fs');
const semver = require('semver');
const cmp = require('semver-compare');

const projects = readdirSync('json-docs');

const projectVersionPairs = [];

projects.forEach((p) => {
  const fullProjectVersions = readdirSync(
    `json-docs/${p}`
  ).filter((v) => v.match(/^\d+\.\d+\.\d+(-[\w\.]+)?$/));

  const projectVersions = fullProjectVersions.map((v) => {
    let [, major, minor] = v.match(/^(\d+)\.(\d+)\.\d+(?:-[\w\.]+)?$/);
    return `${major}.${minor}`;
  });

  const uniqueProjectVersions = [...new Set(projectVersions)];

  uniqueProjectVersions.forEach((uniqVersion) => {
    const sortedPatchVersions = fullProjectVersions
      .filter((projectVersion) => {
        return projectVersion.startsWith(uniqVersion + '.');
      })
      .sort(semver.compare);

    projectVersionPairs.push([p, sortedPatchVersions[sortedPatchVersions.length - 1]]);
  });
});

module.exports = projectVersionPairs;

